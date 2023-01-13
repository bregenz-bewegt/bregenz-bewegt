import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Conversation, Message, User } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async getConversations(
    userId: User['id']
  ): Promise<(Conversation & { participants: User[] })[]> {
    const { conversations } = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { conversations: { include: { participants: true } } },
    });

    return conversations;
  }

  async getConversationWith(
    participantUsername: User['username'],
    userId: User['id']
  ): Promise<Conversation & { participants: User[]; messages: Message[] }> {
    return this.prismaService.conversation.findFirst({
      where: {
        AND: [
          {
            participants: { some: { username: participantUsername } },
          },
          {
            participants: { some: { id: userId } },
          },
        ],
      },
      include: { participants: true, messages: true },
    });
  }

  async createConversation(
    userId: User['id'],
    participantId: User['id']
  ): Promise<Conversation> {
    const exists = await this.prismaService.user.findUnique({
      where: { id: participantId },
    });

    if (!exists) {
      throw new ForbiddenException();
    }

    return this.prismaService.conversation.create({
      data: {
        participants: {
          connect: [{ id: userId }, { id: participantId }],
        },
      },
    });
  }
}
