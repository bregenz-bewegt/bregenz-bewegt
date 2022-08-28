import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { PatchProfileDto } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.user.findMany();
  }

  async getByEmail(email: User['email']) {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  async getById(id: User['id']) {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }

  async patchProfile(id: User['id'], fields: PatchProfileDto) {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        ...fields,
      },
    });
  }
}
