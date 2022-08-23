import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ParkService } from './park.service';

describe('ParkService', () => {
  let service: ParkService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ParkService, PrismaService, ConfigService],
    }).compile();

    service = module.get(ParkService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
