import { AccessTokenGuard } from '@bregenz-bewegt/server/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  profile() {
    return this.userService.getUsers();
  }
}
