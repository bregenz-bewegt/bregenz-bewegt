import { Injectable } from '@nestjs/common';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Conversation, User } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async createConversation(
    userId: User['id'],
    participantsUsernames: string[]
  ): Promise<Conversation> {
    return this.prismaService.conversation.create({
      data: {
        participants: {
          connect: [
            { id: userId },
            ...participantsUsernames.map((u) => ({ username: u })),
          ],
        },
      },
    });
  }
}
