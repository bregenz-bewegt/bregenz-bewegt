import { AuthGuard } from '@nestjs/passport';

export class EmailResetTokenGuard extends AuthGuard('jwt-email-reset') {
  constructor() {
    super();
  }
}
