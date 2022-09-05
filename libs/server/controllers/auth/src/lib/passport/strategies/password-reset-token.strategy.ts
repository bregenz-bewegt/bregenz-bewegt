import { JwtPayloadWithRefreshToken } from '@bregenz-bewegt/shared/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class PasswordResetTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-password-reset'
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('NX_JWT_PASSWORD_RESET_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any): JwtPayloadWithRefreshToken {
    const resetToken = req.get('authorization').replace('Bearer', '').trim();

    if (!resetToken)
      throw new ForbiddenException('Incorrect password reset token');

    return {
      ...payload,
      refreshToken: resetToken,
    };
  }
}
