import { Public } from '@bregenz-bewegt/server/common';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Exercise, Park } from '@prisma/client';
import { ParkService } from './park.service';

@Controller('parks')
export class ParkController {
  constructor(private parkService: ParkService) {}

  @Public()
  @Get()
  getParks(): Promise<Park[]> {
    return this.parkService.findAll();
  }

  @Public()
  @Get(':id')
  getPark(@Param('id', ParseIntPipe) id: number): Promise<Park> {
    return this.parkService.findById(id);
  }

  @Get(':id/exercises')
  getParkWithExercises(@Param('id', ParseIntPipe) id: number): Promise<
    Park & {
      exercises: Exercise[];
    }
  > {
    return this.parkService.findByIdWithExercises(id);
  }

  @Get(':park/exercises/:exercise')
  getParkWithExercise(
    @Param('park', ParseIntPipe) park: number,
    @Param('exercise', ParseIntPipe) exercise: number
  ) {
    return this.parkService.getParkWithExercise(park, exercise);
  }
}
