import { Public } from '@bregenz-bewegt/server/common';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ParkService } from './park.service';

@Controller('parks')
export class ParkController {
  constructor(private parkService: ParkService) {}

  @Public()
  @Get()
  getParks() {
    return this.parkService.getParks();
  }

  @Public()
  @Get(':id')
  getPark(@Param('id', ParseIntPipe) id: number) {
    return this.parkService.getPark(id);
  }

  @Get(':id/exercises')
  getParkWithExercises(@Param('id', ParseIntPipe) id: number) {
    return this.parkService.getParkWithExercises(id);
  }
}
