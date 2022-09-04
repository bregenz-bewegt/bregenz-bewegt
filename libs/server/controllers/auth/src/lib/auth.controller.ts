import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto, RegisterDto, Tokens } from '@bregenz-bewegt/shared/types';
import { AuthService } from './auth.service';

import {
  GetCurrentUser,
  Public,
  RefreshTokenGuard,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';

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

  @Post('reset-password')
  resetPassword() {
    return this.authService.resetPassword();
  }
}
