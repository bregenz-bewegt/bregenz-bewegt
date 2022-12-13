import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NotificationService, PrismaService, ConfigService],
      controllers: [NotificationController],
    }).compile();

    controller = module.get(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
