import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getUsers() {
    return this.prismaService.user.findMany();
  }

  async findOne(email: string) {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }
}
