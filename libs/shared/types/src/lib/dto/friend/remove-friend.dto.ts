import { Friend } from '@bregenz-bewegt/client/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveFriendDto {
  @ApiProperty()
  @IsString()
  friendId: Friend['id'];
}
