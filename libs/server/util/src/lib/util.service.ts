import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  extractBearerToken(authorization: string) {
    return authorization.replace('Bearer', '').trim();
  }
}
