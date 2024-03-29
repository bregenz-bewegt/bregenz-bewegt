import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { NotificationGateway } from '@bregenz-bewegt/server/controllers/notification';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

describe('FriendController', () => {
  let controller: FriendController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FriendService,
        PrismaService,
        ConfigService,
        NotificationGateway,
      ],
      controllers: [FriendController],
    }).compile();

    controller = module.get(FriendController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
