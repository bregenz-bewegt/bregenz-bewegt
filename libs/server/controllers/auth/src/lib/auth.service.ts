import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import {
  JwtPayload,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  Tokens,
  VerifyDto,
} from '@bregenz-bewegt/shared/types';
import {
  loginError,
  registerError,
  RegisterErrorResponse,
} from '@bregenz-bewegt/server/common';
import { MailService } from '@bregenz-bewegt/server/mail';
import * as nanoid from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService
  ) {}

  async guest() {
    const newGuest = await this.prismaService.user.create({
      data: {
        role: 'GUEST',
      },
    });

    return newGuest;
  }

  async register(dto: RegisterDto) {
    const { password, ...rest } = dto;
    const hash = await argon.hash(password);

    try {
      await this.prismaService.user.create({
        data: {
          ...rest,
          password: hash,
          role: 'USER',
        },
      });

      const pin = nanoid.customAlphabet('0123456789', 6);
      return pin;
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

  async verify(dto: VerifyDto) {
    console.log(dto);
    // const tokens = await this.signTokens(newUser.id, newUser.email);
    // this.updateRefreshToken(newUser.id, tokens.refresh_token);
    // return tokens;
  }

  async login(dto: LoginDto) {
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

    const tokens = await this.signTokens(user.id, user.email);
    this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
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

  async signTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
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

  async refreshTokens(userId: string, refreshToken: string) {
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

    const tokens = await this.signTokens(user.id, user.email);
    this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
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

  async signPasswordResetToken(userId: string, email: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
      secret: this.configService.get('NX_JWT_PASSWORD_RESET_TOKEN_SECRET'),
    });

    return token;
  }

  async forgotPassword(userId: User['id'], email: User['email']) {
    const token = await this.signPasswordResetToken(userId, email);
    const tokenHash = await argon.hash(token);

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: tokenHash,
      },
    });

    if (!user || !user.passwordResetToken) {
      throw new ForbiddenException('Access denied');
    }

    return this.mailService.sendPasswordResetMail({
      to: email,
      resetToken: token,
    });
  }

  async resetPassword(email: string, token: string, dto: ResetPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    const tokenValid = await argon.verify(user.passwordResetToken, token);

    if (!user || !user.passwordResetToken || !tokenValid) {
      throw new ForbiddenException('Access denied');
    }

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
