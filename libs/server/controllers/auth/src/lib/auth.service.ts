import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserService } from '@bregenz-bewegt/server-controllers-user';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import {
  JwtPayload,
  LoginDto,
  defaultLoginError,
  RegisterDto,
  Tokens,
  RegisterError,
} from '@bregenz-bewegt/shared/types';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async guest() {
    //
  }

  async register(dto: RegisterDto) {
    const hash = await argon.hash(dto.password);

    try {
      const newUser = await this.prismaService.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
          role: 'USER',
        },
      });

      const tokens = await this.signTokens(newUser.id, newUser.email);
      this.updateRefreshToken(newUser.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(<RegisterError>{
            ...((error.meta.target as string).includes('username') && {
              username: 'Benutzername bereits vergeben',
            }),
            ...((error.meta.target as string).includes('email') && {
              email: 'E-Mail Adresse bereits verwendet',
            }),
          });
        }
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException(defaultLoginError);
    }

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches) {
      throw new ForbiddenException(defaultLoginError);
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
}
