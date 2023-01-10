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
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Conversation, Role, User } from '@prisma/client';
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
  @Post('conversations/create')
  async createConversation(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: CreateConversationDto
  ): Promise<Conversation> {
    return this.chatService.createConversation(userId, dto.participants);
  }
}
