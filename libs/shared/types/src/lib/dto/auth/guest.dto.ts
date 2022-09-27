import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GuestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  visitorId: string;
}
