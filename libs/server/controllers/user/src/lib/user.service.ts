import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.user.findMany();
  }

  async findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  async findOneById(id: string) {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }
}
