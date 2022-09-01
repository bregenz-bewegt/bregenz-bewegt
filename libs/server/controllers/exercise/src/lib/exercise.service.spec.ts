import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ExerciseService } from './exercise.service';

describe('ExerciseService', () => {
  let service: ExerciseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ExerciseService, PrismaService, ConfigService],
    }).compile();

    service = module.get(ExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
