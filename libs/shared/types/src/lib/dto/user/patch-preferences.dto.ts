import { ApiProperty } from '@nestjs/swagger';
import { DifficultyType } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PatchPreferencesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  difficulties?: DifficultyType[];
}
