import { MapStaticAssetPathInterceptor } from '@bregenz-bewegt/server/common';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Exercise } from '@prisma/client';
import { ExerciseService } from './exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Get(':id')
  @UseInterceptors(new MapStaticAssetPathInterceptor())
  getExercise(
    @Param('id', ParseIntPipe) id: Exercise['id']
  ): Promise<Exercise> {
    return this.exerciseService.findById(id);
  }
}
