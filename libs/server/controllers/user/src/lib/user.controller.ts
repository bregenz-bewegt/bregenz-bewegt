import {
  GetCurrentUser,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { PatchProfileDto } from '@bregenz-bewegt/shared/types';
import { Body, Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get()
  getUsers() {
    return this.userService.getAll();
  }

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('profile')
  getUser(@GetCurrentUser('sub') userId: string) {
    return this.userService.getById(userId);
  }

  @Patch('profile')
  patchProfile(
    @GetCurrentUser('sub') userId: string,
    @Body() dto: PatchProfileDto
  ) {
    this.userService.patchProfile(userId, dto);
  }
}
