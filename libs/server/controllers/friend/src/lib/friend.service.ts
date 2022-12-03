import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  FriendSearchResult,
  CreateFriendRequestDto,
  FriendAdresseeResult,
  FriendRequesteeResult,
  AcceptFriendRequestDto,
  RemoveFriendDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, FriendRequest, Role } from '@prisma/client';
import { SearchService } from '@bregenz-bewegt/server/search';

@Injectable()
export class FriendService {
  constructor(
    private prismaService: PrismaService,
    private searchService: SearchService
  ) {}

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
    const maxSearchResults = 50;

    const { friendRequests } = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { friendRequests: { where: { requestee: { id: userId } } } },
    });

    const candidates = await this.prismaService.user.findMany({
      where: {
        AND: [
          {
            role: { not: Role.GUEST },
          },
          {
            id: { not: userId },
          },
          {
            friends: { none: { id: userId } },
          },
        ],
      },
      select: { username: true },
    });

    const fullTextSearchResult = await this.searchService.search(
      {
        username: 'string',
      },
      candidates,
      { term: query, properties: '*', tolerance: 100, limit: maxSearchResults }
    );

    const searchResult = await this.prismaService.user.findMany({
      where: {
        username: { in: fullTextSearchResult.map((result) => result.username) },
      },
      select: { id: true, username: true, profilePicture: true },
    });

    return <FriendSearchResult[]>searchResult.map((user) => ({
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
        AND: [
          {
            requestee: { id: requesteeId },
          },
          {
            acceptedAt: null,
          },
        ],
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
        AND: [
          {
            addressee: { id: addresseeId },
          },
          {
            acceptedAt: null,
          },
        ],
      },
      include: {
        requestee: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });
  }

  async deleteFriendRequest(
    requestId: FriendRequest['id']
  ): Promise<FriendRequest> {
    return this.prismaService.friendRequest.delete({
      where: { id: requestId },
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

  async removeFriend(userId: User['id'], dto: RemoveFriendDto): Promise<User> {
    await this.prismaService.friendRequest.deleteMany({
      where: {
        OR: [
          {
            AND: [
              {
                requestee: { id: userId },
              },
              {
                addressee: { id: dto.friendId },
              },
            ],
          },
          {
            AND: [
              {
                addressee: { id: userId },
              },
              {
                requestee: { id: dto.friendId },
              },
            ],
          },
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
