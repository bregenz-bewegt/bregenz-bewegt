import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import cuid from 'cuid';
import speakeasy from 'speakeasy';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Prisma, Role, User } from '@prisma/client';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  GuestDto,
  JwtPayload,
  JwtPayloadWithoutRole,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  Tokens,
  VerifyDto,
} from '@bregenz-bewegt/shared/types';
import {
  changePasswordError,
  forgotPasswordError,
  loginError,
  registerError,
  RegisterErrorResponse,
  verifyError,
} from '@bregenz-bewegt/shared/errors';
import { MailService } from '@bregenz-bewegt/server/mail';
import { UserService } from '@bregenz-bewegt/server-controllers-user';
import { UtilService } from '@bregenz-bewegt/server/util';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private userService: UserService,
    private utilService: UtilService
  ) {}

  async guest(dto: GuestDto): Promise<Tokens> {
    const usernamePrefix = 'Gast#' as const;
    const returnTokens = async (
      payload: JwtPayload<'GUEST'>
    ): Promise<Tokens> => {
      const tokens = await this.signTokens<'GUEST'>(payload);
      this.updateRefreshToken(payload.sub, tokens.refresh_token);
      return tokens;
    };

    const guest = await this.prismaService.user.findUnique({
      where: {
        fingerprint: dto.visitorId,
      },
    });

    if (guest) {
      return returnTokens({ sub: guest.id, role: guest.role });
    }

    const newGuest = await this.prismaService.user.create({
      data: {
        role: 'GUEST',
        fingerprint: dto.visitorId,
        username: `${usernamePrefix}${cuid.slug()}`,
        active: true,
      },
    });

    return returnTokens({ sub: newGuest.id, role: newGuest.role });
  }

  async register(dto: RegisterDto): Promise<void> {
    try {
      const { password, ...rest } = dto;
      const hash = await argon.hash(password);
      const { token, secret: activationSecret } =
        this.utilService.generateOtpToken();

      const newUser = await this.prismaService.user.create({
        data: {
          ...rest,
          password: hash,
          role: 'USER',
          activationSecret,
          preferences: {
            create: {
              public: true,
              difficulties: {
                connect: (
                  await this.prismaService.difficulty.findMany()
                ).map((d) => ({ id: d.id })),
              },
            },
          },
        },
      });

      this.mailService.sendOtpActivationMail({
        to: newUser.email,
        otp: token,
        name: newUser.firstname ?? newUser.username,
      });
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
      const { token, secret: activationSecret } =
        this.utilService.generateOtpToken();

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
        name: updatedUser.firstname ?? updatedUser.username,
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

  async signTokens<R extends Role>(payload: JwtPayload<R>): Promise<Tokens> {
    const jwtPayload: JwtPayload<R> = {
      ...payload,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '15m',
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

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException(forgotPasswordError.USER_NOT_FOUND);
    }

    const token = await this.signPasswordResetToken(user.id, dto.email);
    const tokenHash = await argon.hash(token);

    const newUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: tokenHash,
      },
    });

    return this.mailService.sendPasswordResetmail({
      to: dto.email,
      resetToken: token,
      name: newUser.firstname ?? newUser.username,
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
        passwordResetToken: null,
        password: passwordHash,
      },
    });
  }

  async changePassword(
    userId: User['id'],
    dto: ChangePasswordDto
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches) {
      throw new ForbiddenException(changePasswordError.INVALID_PASSWORD);
    }

    const passwordNotChanged = await argon.verify(
      user.password,
      dto.newPassword
    );

    if (passwordNotChanged) {
      throw new ForbiddenException(changePasswordError.PASSWORD_NOT_CHANGED);
    }

    const passwordHash = await argon.hash(dto.newPassword);

    return this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
      },
    });
  }
}
