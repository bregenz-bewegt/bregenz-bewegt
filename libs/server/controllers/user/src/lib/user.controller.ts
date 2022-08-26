import {
  GetCurrentUser,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('profile')
  getUser(@GetCurrentUser('sub') userId: string) {
    return this.userService.getUserById(userId);
  }
}
