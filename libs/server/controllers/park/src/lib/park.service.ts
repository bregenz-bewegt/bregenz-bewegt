import { map } from 'rxjs';
import { DifficultyType } from './../../../../../client/types/src/lib/entities/difficulty';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { Difficulty, Exercise, Park } from '@prisma/client';
import e from 'express';

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
