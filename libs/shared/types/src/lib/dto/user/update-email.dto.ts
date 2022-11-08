import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
