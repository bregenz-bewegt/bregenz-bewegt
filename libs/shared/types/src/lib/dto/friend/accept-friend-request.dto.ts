import { FriendRequest } from '@bregenz-bewegt/client/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AcceptFriendRequestDto {
  @ApiProperty()
  @IsString()
  requestId: FriendRequest['id'];
}
