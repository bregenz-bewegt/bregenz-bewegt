import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class LeaderboardPaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  take: number;
}
