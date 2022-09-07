import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getParkWithExercises(id: Park['id']) {
    const park = await this.prismaService.park.findUnique({
      where: {
        id: id,
      },
      include: {
        exercises: true,
      },
    });

    if (!park) throw new NotFoundException();
    return park;
  }
}
