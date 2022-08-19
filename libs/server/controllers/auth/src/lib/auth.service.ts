import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserService } from '@bregenz-bewegt/server-controllers-user';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async signToken(userId: string, email: string): Promise<{ access_token }> {
    const payload = { sub: userId, email };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException();

    const passwordMatch = await argon.verify(user.password, dto.password);

    if (!passwordMatch) throw new ForbiddenException();

    return this.signToken(user.id, user.email);
  }

  async signUp(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);

    return 'signed up';
  }
}
