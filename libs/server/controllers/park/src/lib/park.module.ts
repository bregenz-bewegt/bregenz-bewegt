import { Module } from '@nestjs/common';
import { ParkController } from './park.controller';
import { ParkService } from './park.service';

@Module({
  controllers: [ParkController],
  providers: [ParkService],
  exports: [ParkService],
})
export class ParkModule {}
