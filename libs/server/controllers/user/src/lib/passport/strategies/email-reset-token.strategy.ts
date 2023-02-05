import { JwtPayloadWithRefreshToken } from '@bregenz-bewegt/shared/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class EmailResetTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-email-reset'
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('NX_JWT_EMAIL_RESET_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any): JwtPayloadWithRefreshToken {
    const resetToken = req.get('authorization').replace('Bearer', '').trim();

    if (!resetToken) throw new ForbiddenException('Invalid email reset token');

    return {
      ...payload,
      resetToken,
    };
  }
}
