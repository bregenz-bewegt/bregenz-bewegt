import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Test } from '@nestjs/testing';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

describe('ExerciseController', () => {
  let controller: ExerciseController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ExerciseService, PrismaService],
      controllers: [ExerciseController],
    }).compile();

    controller = module.get(ExerciseController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
