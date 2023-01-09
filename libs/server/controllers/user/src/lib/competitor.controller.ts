import {
  MapProfilePictureInterceptor,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CompetitorDetail } from '@bregenz-bewegt/shared/types';

@Controller('competitors')
export class CompetitorController {
  constructor(private userService: UserService) {}

  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  @Get('profile/:username')
  async getCompetitorProfile(
    @Param('username')
    username: User['username']
  ): Promise<CompetitorDetail> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, email, ...result } = await this.userService.findByUsername(
      username
    );
    return result;
  }
}
