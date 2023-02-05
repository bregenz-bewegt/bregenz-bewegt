import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { NotificationGateway } from '@bregenz-bewegt/server/controllers/notification';
import { FriendService } from './friend.service';

describe('FriendService', () => {
  let service: FriendService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FriendService,
        PrismaService,
        ConfigService,
        NotificationGateway,
      ],
    }).compile();

    service = module.get(FriendService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
