import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Conversation, Message, User } from '@prisma/client';
import { CreateMessageDto } from '@bregenz-bewegt/shared/types';

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
  ): Promise<
    Conversation & {
      participants: User[];
      messages: (Message & { author: User })[];
    }
  > {
    const conversation = this.prismaService.conversation.findFirst({
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
      include: { participants: true, messages: { include: { author: true } } },
    });

    if (!conversation) throw new NotFoundException();

    return conversation;
  }

  async getConversationById(
    conversationId: Conversation['id']
  ): Promise<Conversation & { participants: User[] }> {
    return this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: { participants: true },
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

  async createMessage(
    userId: User['id'],
    dto: CreateMessageDto
  ): Promise<Message & { author: User }> {
    const conversationExists = await this.prismaService.conversation.findUnique(
      {
        where: { id: dto.conversationId },
      }
    );

    if (!conversationExists) {
      return;
    }

    return this.prismaService.message.create({
      data: {
        text: dto.text,
        author: { connect: { id: userId } },
        conversation: { connect: { id: dto.conversationId } },
      },
      include: { author: true },
    });
  }
}
