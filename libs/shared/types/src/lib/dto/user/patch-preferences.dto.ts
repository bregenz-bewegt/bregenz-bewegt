import { ApiProperty } from '@nestjs/swagger';
import { DifficultyType } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PatchPreferencesDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  difficulties?: DifficultyType[];
}
