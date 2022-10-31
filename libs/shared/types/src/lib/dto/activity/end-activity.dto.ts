import { Exercise, Park } from '@prisma/client';
import { IsNumber, IsPositive } from 'class-validator';

export class EndActivityDto {
  @IsNumber()
  @IsPositive()
  exerciseId: Exercise['id'];

  @IsNumber()
  @IsPositive()
  parkId: Park['id'];
}
