import {
  MapParkImagePathInterceptor,
  Public,
} from '@bregenz-bewegt/server/common';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Coordinates, DifficultyType, Exercise, Park } from '@prisma/client';
import { ParkService } from './park.service';

@Controller('parks')
export class ParkController {
  constructor(private parkService: ParkService) {}

  @Public()
  @UseInterceptors(MapParkImagePathInterceptor)
  @Get()
  getParks(): Promise<(Park & { coordinates: Coordinates })[]> {
    return this.parkService.findAll();
  }

  @Public()
  @UseInterceptors(MapParkImagePathInterceptor)
  @Get(':id')
  getPark(@Param('id', ParseIntPipe) id: number): Promise<Park> {
    return this.parkService.findById(id);
  }

  @UseInterceptors(MapParkImagePathInterceptor)
  @Get(':id/exercises')
  getParkWithExercises(@Param('id', ParseIntPipe) id: number): Promise<
    Park & {
      exercises: (Exercise & { difficulty: DifficultyType })[];
    }
  > {
    return this.parkService.findByIdWithExercises(id);
  }

  @UseInterceptors(MapParkImagePathInterceptor)
  @Get(':park/exercises/:exercise')
  getParkWithExercise(
    @Param('park', ParseIntPipe) park: number,
    @Param('exercise', ParseIntPipe) exercise: number
  ): Promise<
    Park & { exercises: [Exercise & { difficulty: DifficultyType }] }
  > {
    return this.parkService.findByIdWithExercise(park, exercise);
  }
}
