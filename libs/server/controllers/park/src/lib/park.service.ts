import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { Coordinates, DifficultyType, Exercise, Park } from '@prisma/client';

@Injectable()
export class ParkService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<(Park & { coordinates: Coordinates })[]> {
    return this.prismaService.park.findMany({ include: { coordinates: true } });
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
      exercises: (Exercise & { difficulty: DifficultyType })[];
    }
  > {
    const park = await this.prismaService.park.findUnique({
      where: {
        id: id,
      },
      include: {
        exercises: {
          include: { difficulty: true },
        },
      },
    });

    return {
      ...park,
      exercises: park.exercises.map((e) => ({
        ...e,
        difficulty: e.difficulty.difficulty,
      })) as (Exercise & { difficulty: DifficultyType })[],
    };
  }

  async findByIdWithExercise(
    parkId: Park['id'],
    exerciseId: Exercise['id']
  ): Promise<
    Park & { exercises: [Exercise & { difficulty: DifficultyType }] }
  > {
    const park = await this.prismaService.park.findUnique({
      where: {
        id: parkId,
      },
      include: {
        exercises: {
          where: { id: exerciseId },
          include: {
            difficulty: true,
          },
        },
        coordinates: true,
      },
    });

    return {
      ...park,
      exercises: [
        {
          ...park.exercises[0],
          difficulty: park.exercises[0].difficulty.difficulty,
        },
      ],
    } as unknown as Park & {
      exercises: [Exercise & { difficulty: DifficultyType }];
    };
  }
}
