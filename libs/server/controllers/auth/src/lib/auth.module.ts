import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { PrismaModule } from '@bregenz-bewegt/server-prisma';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenStrategy,
  PasswordResetTokenStrategy,
  RefreshTokenStrategy,
} from './passport/strategies';
import { MailModule } from '@bregenz-bewegt/server/mail';
import { UtilModule } from '@bregenz-bewegt/server/util';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UserModule,
    PassportModule,
    PrismaModule,
    JwtModule.register({}),
    MailModule,
    UtilModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    PasswordResetTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
