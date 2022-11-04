import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCompetitorDto {
  @ApiProperty()
  @Transform(({ value }) => +value)
  @IsNumber()
  year: number;
}
