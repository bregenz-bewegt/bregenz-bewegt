import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import speakeasy from 'speakeasy';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import {
  GuestDto,
  JwtPayload,
  JwtPayloadWithoutEmail,
  JwtPayloadWithoutRole,
  LoginDto,
  OtpWithSecret,
  RegisterDto,
  ResetPasswordDto,
  Tokens,
  VerifyDto,
} from '@bregenz-bewegt/shared/types';
import {
  forgotPasswordError,
  loginError,
  registerError,
  RegisterErrorResponse,
  verifyError,
} from '@bregenz-bewegt/shared/errors';
import { MailService } from '@bregenz-bewegt/server/mail';
import { UserService } from '@bregenz-bewegt/server-controllers-user';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private userService: UserService
  ) {}

  async guest(dto: GuestDto): Promise<Tokens> {
    const guest = await this.prismaService.user.create({
      data: {
        role: 'GUEST',
        username: dto.visitorId,
        active: true,
      },
    });

    const tokens = await this.signTokens<JwtPayloadWithoutEmail>({
      sub: guest.id,
      role: guest.role,
    });
    this.updateRefreshToken(guest.id, tokens.refresh_token);
    return tokens;
  }

  async register(dto: RegisterDto): Promise<void> {
    try {
      const { password, ...rest } = dto;
      const hash = await argon.hash(password);
      const { token, secret: activationSecret } = this.generateOtpToken();

      const newUser = await this.prismaService.user.create({
        data: {
          ...rest,
          password: hash,
          role: 'USER',
          activationSecret,
        },
      });

      this.mailService.sendOtpActivationMail({ to: newUser.email, otp: token });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(<RegisterErrorResponse>{
            ...((error.meta.target as string).includes('username') &&
              registerError.USERNAME_TAKEN),
            ...((error.meta.target as string).includes('email') &&
              registerError.EMAIL_TAKEN),
          });
        }
      }

      throw error;
    }
  }

  async verify(dto: VerifyDto): Promise<Tokens> {
    const user = await this.userService.findSingle({ email: dto.email });

    if (!user || !user.activationSecret) {
      throw new ForbiddenException();
    }

    const verified = speakeasy.totp.verify({
      secret: user.activationSecret,
      encoding: 'base32',
      token: dto.token,
      window: 2,
    });

    if (!verified) {
      throw new ForbiddenException(verifyError.INVALID_TOKEN);
    }

    await this.prismaService.user.update({
      where: { email: user.email },
      data: {
        activationSecret: null,
        active: true,
      },
    });

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException(loginError.USER_NOT_FOUND);
    }

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches) {
      throw new ForbiddenException(loginError.INVALID_CREDENTIALS);
    }

    if (!user.active) {
      const { token, secret: activationSecret } = this.generateOtpToken();

      const updatedUser = await this.prismaService.user.update({
        where: {
          email: dto.email,
        },
        data: {
          activationSecret,
        },
      });

      this.mailService.sendOtpActivationMail({
        to: updatedUser.email,
        otp: token,
      });
      throw new ForbiddenException(loginError.EMAIL_NOT_VERIFIED);
    }

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async signTokens<
    PayloadType extends JwtPayload | JwtPayloadWithoutEmail = JwtPayload
  >(payload: PayloadType): Promise<Tokens> {
    const jwtPayload: PayloadType = {
      ...payload,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '3s',
        secret: this.configService.get('NX_JWT_ACCESS_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '7d',
        secret: this.configService.get('NX_JWT_REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied');

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const hash = await argon.hash(refreshToken);

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }

  async signPasswordResetToken(userId: string, email: string): Promise<string> {
    const jwtPayload: JwtPayloadWithoutRole = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
      secret: this.configService.get('NX_JWT_PASSWORD_RESET_TOKEN_SECRET'),
    });

    return token;
  }

  generateOtpToken(): OtpWithSecret {
    const secret = speakeasy.generateSecret().base32;
    const token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });

    return { token, secret };
  }

  async changePassword(email: User['email']): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ForbiddenException(forgotPasswordError.USER_NOT_FOUND);
    }

    const token = await this.signPasswordResetToken(user.id, email);
    const tokenHash = await argon.hash(token);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: tokenHash,
      },
    });

    return this.mailService.sendPasswordResetmail({
      to: email,
      resetToken: token,
    });
  }

  async validateResetPassword(email: string, token: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !user.passwordResetToken) {
      throw new ForbiddenException('Access denied');
    }

    const tokenValid = await argon.verify(user.passwordResetToken, token);

    if (!tokenValid) {
      throw new ForbiddenException('Access denied');
    }
  }

  async resetPassword(
    email: string,
    token: string,
    dto: ResetPasswordDto
  ): Promise<User> {
    await this.validateResetPassword(email, token);

    const passwordHash = await argon.hash(dto.password);
    return this.prismaService.user.update({
      where: {
        email: email,
      },
      data: {
        password: passwordHash,
      },
    });
  }
}
