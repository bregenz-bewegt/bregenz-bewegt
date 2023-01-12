import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { NotificationGateway } from '@bregenz-bewegt/server/controllers/notification';
import {
  UserSearchResult,
  CreateFriendRequestDto,
  FriendAdresseeResult,
  FriendRequesteeResult,
  AcceptFriendRequestDto,
  RemoveFriendDto,
  FriendSearchResult,
  SearchFriendQueryDto,
  GetFriendsQueryDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, FriendRequest, Role, NotificationType } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(
    private prismaService: PrismaService,
    private notificationGateway: NotificationGateway
  ) {}

  async getFriends(
    dto: GetFriendsQueryDto,
    userId: User['id']
  ): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: {
        AND: [
          {
            friends: { some: { id: userId } },
          },
          dto.onlyConversationsless
            ? {
                conversations: {
                  every: { participants: { none: { id: userId } } },
                },
              }
            : {},
        ],
      },
    });
  }

  async searchUserByUsername(
    query: string,
    userId: User['id']
  ): Promise<UserSearchResult[]> {
    const maxSearchResults = 50;
    const users = (
      await this.prismaService.user.findMany({
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
            {
              username: { contains: query },
            },
          ],
        },
        orderBy: {
          username: 'asc',
        },
        select: { id: true, username: true, profilePicture: true },
      })
    )
      .reduce(
        ([a, b], c) =>
          c.username.toLowerCase().startsWith(query)
            ? [[...a, c], b]
            : [a, [...b, c]],
        [[], []]
      )
      .reduce((p, c) => [...p, ...c], [])
      .slice(0, maxSearchResults);

    const { friendRequests } = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { friendRequests: { where: { requestee: { id: userId } } } },
    });

    return <UserSearchResult[]>users.map((user) => ({
      ...user,
      isRequested: friendRequests.some((f) => user.id === f.addresseeId),
    }));
  }

  async searchFriendByUsername(
    dto: SearchFriendQueryDto,
    userId: User['id']
  ): Promise<FriendSearchResult[]> {
    const query = dto.username;
    const maxSearchResults = 50;
    const users = (
      await this.prismaService.user.findMany({
        where: {
          AND: [
            {
              role: { not: Role.GUEST },
            },
            {
              id: { not: userId },
            },
            {
              friends: { some: { id: userId } },
            },
            {
              username: { contains: query },
            },
            dto.onlyConversationsless
              ? {
                  conversations: {
                    every: { participants: { none: { id: userId } } },
                  },
                }
              : {},
          ],
        },
        orderBy: {
          username: 'asc',
        },
        select: { id: true, username: true, profilePicture: true },
      })
    )
      .reduce(
        ([a, b], c) =>
          c.username.toLowerCase().startsWith(query)
            ? [[...a, c], b]
            : [a, [...b, c]],
        [[], []]
      )
      .reduce((p, c) => [...p, ...c], [])
      .slice(0, maxSearchResults);

    return users as FriendSearchResult[];
  }

  async createFriendRequest(
    data: CreateFriendRequestDto & { requesteeId: User['id'] }
  ): Promise<FriendRequest> {
    const requestee = await this.prismaService.user.findUnique({
      where: { id: data.requesteeId },
    });

    const notification = await this.prismaService.notification.create({
      data: {
        title: 'Neue Freundschaftsanfrage',
        description: `${requestee.username} hat dir eine Freundschaftsanfrage gesendet`,
        type: NotificationType.FRIEND_REQUEST_RECEIVED,
        user: { connect: { id: data.addresseeId } },
      },
    });

    this.notificationGateway.emitNotification(notification);

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
    const friendRequest = await this.prismaService.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) return;

    return this.prismaService.friendRequest.delete({
      where: { id: requestId },
    });
  }

  async acceptFriendRequest(
    userId: User['id'],
    dto: AcceptFriendRequestDto
  ): Promise<FriendRequest> {
    const exists = await this.prismaService.friendRequest.findUnique({
      where: { id: dto.requestId },
    });
    if (!exists) return;

    const friendRequest = await this.prismaService.friendRequest.update({
      where: { id: dto.requestId },
      data: { acceptedAt: new Date() },
    });

    const self = await this.prismaService.user.update({
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

    const notification = await this.prismaService.notification.create({
      data: {
        title: `Freundschaftsanfrage angenommen`,
        description: `${self.username} hat deine Freundschaftsanfrage angenommen`,
        type: NotificationType.FRIEND_REQUEST_ACCEPTED,
        user: { connect: { id: friendRequest.requesteeId } },
      },
    });

    this.notificationGateway.emitNotification(notification);

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
