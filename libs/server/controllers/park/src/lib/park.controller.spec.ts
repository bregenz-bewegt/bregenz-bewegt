import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ParkController } from './park.controller';
import { ParkService } from './park.service';

describe('ParkController', () => {
  let controller: ParkController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ParkService, PrismaService, ConfigService],
      controllers: [ParkController],
    }).compile();

    controller = module.get(ParkController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
