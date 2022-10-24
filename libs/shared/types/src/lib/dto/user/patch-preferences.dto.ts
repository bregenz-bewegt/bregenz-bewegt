import { ApiProperty } from '@nestjs/swagger';
import { DifficultyType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class PatchPreferencesDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  difficulties?: DifficultyType[];
}
