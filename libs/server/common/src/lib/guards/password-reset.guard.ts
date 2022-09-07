import { AuthGuard } from '@nestjs/passport';

export class PasswordResetTokenGuard extends AuthGuard('jwt-password-reset') {
  constructor() {
    super();
  }
}
