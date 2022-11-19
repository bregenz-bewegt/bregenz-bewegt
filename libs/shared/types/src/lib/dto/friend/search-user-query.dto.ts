import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchUserQueryDto {
  @ApiProperty()
  @IsString()
  username: string;
}
