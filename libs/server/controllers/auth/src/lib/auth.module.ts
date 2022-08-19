import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { PrismaModule } from '@bregenz-bewegt/server-prisma';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport/strategies/local.strategy';

@Module({
  imports: [UserModule, PassportModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
