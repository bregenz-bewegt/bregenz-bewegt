import { FriendRequest } from '@bregenz-bewegt/client/types';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsString({ each: true })
  participants:
}
