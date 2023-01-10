import { Test } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChatService, PrismaService, ConfigService],
    }).compile();

    service = module.get(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
