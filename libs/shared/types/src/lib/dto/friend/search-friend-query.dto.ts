import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchFriendQueryDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  // @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyConversationsless: boolean;
}
