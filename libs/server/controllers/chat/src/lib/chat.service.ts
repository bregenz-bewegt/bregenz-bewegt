import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Conversation, User } from '@prisma/client';

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
