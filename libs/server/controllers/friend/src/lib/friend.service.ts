import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  FriendSearchResult,
  CreateFriendRequestDto,
  FriendAdresseeResult,
  FriendRequesteeResult,
  RevokeFriendRequestDto,
  AcceptFriendRequestDto,
  RejectFriendRequestDto,
  RemoveFriendDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, FriendRequest } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private prismaService: PrismaService) {}

  async getFriends(userId: User['id']): Promise<User[]> {
    const { friends } = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { friends: true },
    });

    return friends;
  }

  async searchUserByUsername(
    query: string,
    userId: User['id']
  ): Promise<FriendSearchResult[]> {
    const maxSearchResults = 100;
    const users = await this.prismaService.user.findMany({
      where: {
        username: { contains: query },
        AND: { id: { not: userId } },
      },
      take: maxSearchResults,
    });

    const { friendRequests } = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { friendRequests: { where: { requestee: { id: userId } } } },
    });

    return <FriendSearchResult[]>users.map((user) => ({
      ...user,
      isRequested: friendRequests.some((f) => user.id === f.addresseeId),
    }));
  }

  async createFriendRequest(
    data: CreateFriendRequestDto & { requesteeId: User['id'] }
  ): Promise<FriendRequest> {
    return this.prismaService.friendRequest.create({
      data: {
        requestee: { connect: { id: data.requesteeId } },
        addressee: { connect: { id: data.addresseeId } },
      },
    });
  }

  async getRequestedFriendRequests(
    requesteeId: FriendRequest['requesteeId']
  ): Promise<(FriendRequest & { addressee: FriendAdresseeResult })[]> {
    return this.prismaService.friendRequest.findMany({
      where: {
        requestee: { id: requesteeId },
        AND: {
          OR: [
            {
              acceptedAt: null,
            },
            {
              addressee: {
                friends: {
                  none: { id: requesteeId },
                },
              },
            },
          ],
        },
      },
      include: {
        addressee: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });
  }

  async getReceivedFriendRequests(
    addresseeId: FriendRequest['addresseeId']
  ): Promise<(FriendRequest & { requestee: FriendRequesteeResult })[]> {
    return this.prismaService.friendRequest.findMany({
      where: {
        addressee: { id: addresseeId },
        AND: {
          OR: [
            {
              acceptedAt: null,
            },
            {},
          ],
        },
      },
      include: {
        requestee: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });
  }

  async revokeFriendRequest(
    dto: RevokeFriendRequestDto
  ): Promise<FriendRequest> {
    return this.prismaService.friendRequest.delete({
      where: { id: dto.requestId },
    });
  }

  async acceptFriendRequest(
    userId: User['id'],
    dto: AcceptFriendRequestDto
  ): Promise<FriendRequest> {
    const friendRequest = await this.prismaService.friendRequest.update({
      where: { id: dto.requestId },
      data: { acceptedAt: new Date() },
    });

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        friends: { connect: { id: friendRequest.requesteeId } },
      },
    });
    await this.prismaService.user.update({
      where: { id: friendRequest.requesteeId },
      data: {
        friends: { connect: { id: userId } },
      },
    });

    return friendRequest;
  }

  async rejectFriendRequest(
    dto: RejectFriendRequestDto
  ): Promise<FriendRequest> {
    return this.prismaService.friendRequest.delete({
      where: { id: dto.requestId },
    });
  }

  async removeFriend(userId: User['id'], dto: RemoveFriendDto): Promise<User> {
    await this.prismaService.friendRequest.deleteMany({
      where: {
        OR: [
          { requestee: { id: userId } },
          { requestee: { id: dto.friendId } },
        ],
      },
    });

    await this.prismaService.user.update({
      where: { id: dto.friendId },
      data: {
        friends: { disconnect: { id: userId } },
      },
    });

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        friends: { disconnect: { id: dto.friendId } },
      },
    });
  }
}
