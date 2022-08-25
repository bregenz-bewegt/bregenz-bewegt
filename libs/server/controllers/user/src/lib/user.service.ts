import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.user.findMany();
  }

  async getUserByEmail(email: User['email']) {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  async getUserById(id: User['id']) {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }
}
