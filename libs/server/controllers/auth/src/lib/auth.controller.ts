import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  Tokens,
} from '@bregenz-bewegt/shared/types';
import { AuthService } from './auth.service';

import {
  GetCurrentUser,
  Public,
  RefreshTokenGuard,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Post('local/guest')
  guest() {
    return this.authService.guest();
  }

  @Public()
  @Post('local/register')
  register(@Body() dto: RegisterDto): Promise<Tokens> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('local/login')
  login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('logout')
  logout(@GetCurrentUser('sub') userId: string): Promise<void> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('forgot-password')
  forgotPassword(
    @GetCurrentUser('email', 'sub') email: User['email'],
    @GetCurrentUser('sub') userId: User['id']
  ) {
    return this.authService.forgotPassword(userId, email);
  }

  @Public()
  @Post('reset-password/:token')
  resetPassword(@Param('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto);
  }
}
