import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pin: number;
}
