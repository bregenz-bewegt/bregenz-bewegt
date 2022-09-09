import { Injectable } from '@nestjs/common';
import * as otp from 'otp-generator';

@Injectable()
export class UtilService {
  extractBearerToken(authorization: string) {
    return authorization.replace('Bearer', '').trim();
  }

  async generateOtp() {
    return otp.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });
  }
}
