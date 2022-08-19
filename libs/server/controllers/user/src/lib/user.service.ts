import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  getUsers() {
    return prisma.user.findMany();
  }

  async findOne(email: string) {
    return prisma.user.findUnique({ where: { email: email } });
  }
}
