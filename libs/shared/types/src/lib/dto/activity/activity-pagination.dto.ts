import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ActivityPaginationQueryDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsPositive()
  @Min(0)
  take?: number;
}
