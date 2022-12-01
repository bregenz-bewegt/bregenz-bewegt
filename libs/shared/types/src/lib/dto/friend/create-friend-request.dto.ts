import { User } from '@bregenz-bewegt/client/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFriendRequestDto {
  @ApiProperty()
  @IsString()
  addresseeId: User['id'];
}
