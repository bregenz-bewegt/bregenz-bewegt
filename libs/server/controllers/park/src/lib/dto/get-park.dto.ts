import { IsNumberString } from 'class-validator';

export class GetParkDto {
  @IsNumberString()
  id: number;
}
