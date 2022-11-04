import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { Exercise, Park } from '@prisma/client';

@Injectable()
export class ParkService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Park[]> {
    return this.prismaService.park.findMany();
  }

  async findById(id: Park['id']): Promise<Park> {
    return this.prismaService.park.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByIdWithExercises(id: Park['id']): Promise<
    Park & {
      exercises: Exercise[];
    }
  > {
    return this.prismaService.park.findUnique({
      where: {
        id: id,
      },
      include: {
        exercises: true,
      },
    });
  }

  async findByIdWithExercise(
    parkId: Park['id'],
    exerciseId: Exercise['id']
  ): Promise<Park & { exercises: [Exercise] }> {
    return this.prismaService.park.findUnique({
      where: {
        id: parkId,
      },
      include: {
        exercises: {
          where: { id: exerciseId },
        },
      },
    }) as unknown as Park & { exercises: [Exercise] };
  }
}
