import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class LeaderboardPaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  take?: number;
}
