import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchFriendQueryDto {
  @ApiProperty()
  @IsString()
  username: string;
}
