import { IsNumber, Min } from 'class-validator';

export class LeaderboardPaginationDto {
  @IsNumber()
  @Min(0)
  skip: number;

  @IsNumber()
  @Min(1)
  take: number;
}
