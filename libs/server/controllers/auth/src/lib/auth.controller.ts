import {
  Body,
  Controller,
  Headers,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  Tokens,
  VerifyDto,
} from '@bregenz-bewegt/shared/types';
import { AuthService } from './auth.service';

import {
  GetCurrentUser,
  PasswordResetTokenGuard,
  Public,
  RefreshTokenGuard,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { User } from '@prisma/client';
import { UtilService } from '@bregenz-bewegt/server/util';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private utilService: UtilService
  ) {}

  @Public()
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Post('local/guest')
  guest(): Promise<User> {
    return this.authService.guest();
  }

  @Public()
  @Post('local/register')
  register(@Body() dto: RegisterDto): Promise<void> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('local/verify')
  verify(@Body() dto: VerifyDto): Promise<Tokens> {
    return this.authService.verify(dto);
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
  ): Promise<void> {
    return this.authService.forgotPassword(userId, email);
  }

  @Public()
  @UseGuards(PasswordResetTokenGuard)
  @Post('reset-password')
  resetPassword(
    @Headers('authorization') authorization: string,
    @GetCurrentUser('email') email: string,
    @Body() dto: ResetPasswordDto
  ): Promise<User> {
    const token = this.utilService.extractBearerToken(authorization);
    return this.authService.resetPassword(email, token, dto);
  }
}
