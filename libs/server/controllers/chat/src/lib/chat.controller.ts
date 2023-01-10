import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':username')
  async getConversation(): Promise<void> {
    return void 0;
  }
}
