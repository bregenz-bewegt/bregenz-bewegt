import { AccessTokenGuard } from '@bregenz-bewegt/server-controllers-auth';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(AccessTokenGuard)
  @Get()
  profile(@Req() req: Request) {
    return req.user;
  }
}
