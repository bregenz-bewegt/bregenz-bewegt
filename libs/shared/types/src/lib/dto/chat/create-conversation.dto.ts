import { Conversation } from '@bregenz-bewegt/client/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsString({ each: true })
  participants: Conversation['participants'];
}
