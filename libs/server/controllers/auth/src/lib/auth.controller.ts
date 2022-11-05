import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  GuestDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  Tokens,
  VerifyDto,
} from '@bregenz-bewegt/shared/types';
import { AuthService } from './auth.service';
import {
  GetCurrentUser,
  HasRole,
  PasswordResetTokenGuard,
  Public,
  RefreshTokenGuard,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import { Role, User } from '@prisma/client';
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
  guest(@Body() dto: GuestDto): Promise<Tokens> {
    return this.authService.guest(dto);
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

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Post('change-password')
  changePassword(@GetCurrentUser('email') email: User['email']): Promise<void> {
    return this.authService.changePassword(email);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.authService.changePassword(dto.email);
  }

  @Public()
  @UseGuards(PasswordResetTokenGuard)
  @Get('validate-reset-password')
  validateResetPassword(
    @Headers('authorization') authorization: string,
    @GetCurrentUser('email') email: string
  ): Promise<void> {
    const token = this.utilService.extractBearerToken(authorization);
    return this.authService.validateResetPassword(email, token);
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
