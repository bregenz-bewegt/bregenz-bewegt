import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Test } from '@nestjs/testing';
import { ParkService } from './park.service';

describe('ServerControllersParkService', () => {
  let service: ParkService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ParkService, PrismaService],
    }).compile();

    service = module.get(ParkService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
