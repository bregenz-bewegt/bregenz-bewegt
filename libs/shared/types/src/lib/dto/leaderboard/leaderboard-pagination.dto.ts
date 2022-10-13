import { IsOptional } from 'class-validator';

export class LeaderboardPaginationQueryDto {
  @IsOptional()
  skip?: number;

  @IsOptional()
  take?: number;
}
