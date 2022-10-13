import { IsNumber, IsOptional } from 'class-validator';

export class LeaderboardPaginationQueryDto {
  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  take?: number;
}
