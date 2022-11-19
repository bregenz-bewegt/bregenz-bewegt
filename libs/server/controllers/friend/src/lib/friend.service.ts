import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  FriendSearchResult,
  CreateFriendRequestDto,
  FriendAdresseeResult,
  FriendRequesteeResult,
  RevokeFriendRequestDto,
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

  async searchUserFriendByUsername(
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
      where: { requestee: { id: requesteeId } },
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
      where: { addressee: { id: addresseeId } },
      include: {
        requestee: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });
  }

  async revokeFriendRequest(
    userId: User['id'],
    dto: RevokeFriendRequestDto
  ): Promise<void> {
    userId;
    dto;
  }
}
