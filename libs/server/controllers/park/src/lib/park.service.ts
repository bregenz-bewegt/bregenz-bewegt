import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { Exercise, Park } from '@prisma/client';

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
    return this.prismaService.park.findUnique({
      where: {
        id: id,
      },
      include: {
        exercises: true,
      },
    });
  }

  async getParkWithExercise(parkId: Park['id'], exerciseId: Exercise['id']) {
    return this.prismaService.park.findUnique({
      where: {
        id: parkId,
      },
      include: {
        exercises: {
          where: { id: exerciseId },
        },
      },
    });
  }
}
