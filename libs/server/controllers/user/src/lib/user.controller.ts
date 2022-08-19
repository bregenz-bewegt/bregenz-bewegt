import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtGuard } from '@bregenz-bewegt/server-controllers-auth';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  profile(@Req() req: Request) {
    return req.user;
  }
}
