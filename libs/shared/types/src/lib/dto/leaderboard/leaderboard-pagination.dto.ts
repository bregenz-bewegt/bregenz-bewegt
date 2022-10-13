import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LeaderboardPaginationQueryDto {
  @IsNumber()
  skip: number;

  @IsNumber()
  take: number;
}
