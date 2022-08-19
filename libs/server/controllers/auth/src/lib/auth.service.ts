import { UserService } from '@bregenz-bewegt/server-controllers-user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username, password) {
    const user = await this.userService
  }
}
