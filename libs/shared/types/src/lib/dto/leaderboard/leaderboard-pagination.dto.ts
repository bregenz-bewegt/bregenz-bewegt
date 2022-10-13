import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class LeaderboardPaginationDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  skip: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  take: number;
}
