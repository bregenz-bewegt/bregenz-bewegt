import {
  GetCurrentUser,
  MapProfilePictureInterceptor,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('competitors')
export class CompetitorController {
  constructor(private userService: UserService) {}

  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  @Get('profile')
  async getUser(userId: User['id']): User {
    const { id, email, ...result } = await this.userService.findById(userId);
    return result;
  }
}
