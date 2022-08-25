import { Public } from '@bregenz-bewegt/server/common';
import { Controller, Get, Param } from '@nestjs/common';
import { GetParkDto } from './dto';
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
  getPark(@Param() params: GetParkDto) {
    return this.parkService.getPark(+params.id);
  }
}
