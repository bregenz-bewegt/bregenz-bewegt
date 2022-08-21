import { RemoveSensitiveFieldsInterceptor } from '@bregenz-bewegt/server/common';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  profile(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
