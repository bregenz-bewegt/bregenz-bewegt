import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Exercise } from '@prisma/client';
import { ExerciseService } from './exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Get(':id')
  getExercise(
    @Param('id', ParseIntPipe) id: Exercise['id']
  ): Promise<Exercise> {
    return this.exerciseService.findById(id);
  }
}
