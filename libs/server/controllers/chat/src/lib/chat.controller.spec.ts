import { Test } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChatService, PrismaService, ConfigService],
      controllers: [ChatController],
    }).compile();

    controller = module.get(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
