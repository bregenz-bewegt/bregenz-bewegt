import { Test } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChatService],
      controllers: [ChatController],
    }).compile();

    controller = module.get(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
