import { ApiProperty } from '@nestjs/swagger';
import { Exercise, Park } from '@prisma/client';
import { IsNumber, IsPositive } from 'class-validator';

export class StartActivityDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  exerciseId: Exercise['id'];

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  parkId: Park['id'];
}
