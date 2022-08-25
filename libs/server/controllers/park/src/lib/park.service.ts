import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { Park } from '@prisma/client';

@Injectable()
export class ParkService {
  constructor(private prismaService: PrismaService) {}

  async getParks() {
    return this.prismaService.park.findMany();
  }

  async getPark(id: Park['id']) {
    return this.prismaService.park.findUnique({
      where: {
        id: id,
      },
    });
  }
}
