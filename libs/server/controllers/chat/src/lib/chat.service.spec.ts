import { Test } from '@nestjs/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    service = module.get(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
