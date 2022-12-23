import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { NotificationGateway } from 'libs/server/gateway/src/lib/gateways';
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
