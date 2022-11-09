import { OtpWithSecret } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UtilService {
  extractBearerToken(authorization: string) {
    return authorization.replace('Bearer', '').trim();
  }

  generateOtpToken(): OtpWithSecret {
    const secret = speakeasy.generateSecret().base32;
    const token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });

    return { token, secret };
  }
}
