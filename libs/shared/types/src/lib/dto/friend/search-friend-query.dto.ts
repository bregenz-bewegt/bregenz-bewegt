import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchFriendQueryDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  onlyConversationsless?: boolean;
}
