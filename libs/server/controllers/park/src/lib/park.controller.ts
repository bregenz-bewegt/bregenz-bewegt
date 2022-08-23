import { Public } from '@bregenz-bewegt/server/common';
import { Controller, Get } from '@nestjs/common';
import { ParkService } from './park.service';

@Controller('park')
export class ParkController {
  constructor(private parkService: ParkService) {}

  @Public()
  @Get()
  getParks() {
    return this.parkService.getParks();
  }
}
