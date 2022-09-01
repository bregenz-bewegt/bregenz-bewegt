import { Test } from '@nestjs/testing';
import { ExerciseService } from './exercise.service';

describe('ExerciseService', () => {
  let service: ExerciseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ExerciseService],
    }).compile();

    service = module.get(ExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
