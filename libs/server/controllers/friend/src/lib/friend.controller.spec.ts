import { Test } from '@nestjs/testing';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

describe('FriendController', () => {
  let controller: FriendController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FriendService],
      controllers: [FriendController],
    }).compile();

    controller = module.get(FriendController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
