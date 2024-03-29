import {
  GetCurrentUser,
  HasRole,
  MapProfilePictureInterceptor,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import { CreateConversationDto } from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Conversation, Message, Role, User } from '@prisma/client';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(
    new MapProfilePictureInterceptor(),
    RemoveSensitiveFieldsInterceptor
  )
  @Get('conversations')
  async getConversations(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<Conversation[]> {
    return this.chatService.getConversations(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(
    new MapProfilePictureInterceptor(),
    RemoveSensitiveFieldsInterceptor
  )
  @Get('conversation-with/:username')
  async getConversationWithUser(
    @Param('username') participantUsername,
    @GetCurrentUser('sub')
    userId: User['id']
  ): Promise<
    Conversation & {
      participants: User[];
      messages: (Message & { author: User })[];
    }
  > {
    return this.chatService.getConversationWithUser(
      participantUsername,
      userId
    );
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(
    new MapProfilePictureInterceptor(),
    RemoveSensitiveFieldsInterceptor
  )
  @Post('conversations/create')
  async createConversation(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: CreateConversationDto
  ): Promise<Conversation> {
    return this.chatService.createConversation(userId, dto.participantId);
  }
}
