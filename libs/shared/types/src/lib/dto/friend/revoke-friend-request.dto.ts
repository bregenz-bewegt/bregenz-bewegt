import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RevokeFriendRequestDto {
  @ApiProperty()
  @IsString()
  requestId: string;
}
