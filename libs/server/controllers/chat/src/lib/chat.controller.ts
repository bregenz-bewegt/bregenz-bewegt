import { GetCurrentUser } from '@bregenz-bewegt/server/common';
import { CreateConversationDto } from '@bregenz-bewegt/shared/types';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Conversation, User } from '@prisma/client';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversations/create')
  async createConversation(
    @GetCurrentUser() userId: User['id'],
    @Body() dto: CreateConversationDto
  ): Promise<Conversation> {
    return this.chatService.createConversation(userId, dto.participants);
  }

  @Get(':username')
  async getConversation(): Promise<void> {
    return void 0;
  }
}
