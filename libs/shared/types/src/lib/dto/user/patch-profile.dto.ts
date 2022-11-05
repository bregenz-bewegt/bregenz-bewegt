import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class PatchProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}
