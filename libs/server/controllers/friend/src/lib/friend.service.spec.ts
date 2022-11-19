import { Test } from '@nestjs/testing';
import { FriendService } from './friend.service';

describe('FriendService', () => {
  let service: FriendService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FriendService],
    }).compile();

    service = module.get(FriendService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
