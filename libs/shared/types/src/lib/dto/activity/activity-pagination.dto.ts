import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ActivityPaginationQueryDto {
  @ApiProperty()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiProperty()
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsPositive()
  @Min(0)
  take?: number;

  @ApiProperty()
  @Transform(({ value }) => +value)
  @IsNumber()
  year?: number;
}
