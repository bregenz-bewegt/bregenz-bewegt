import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  ActivityPaginationQueryDto,
  EndActivityDto,
  StartActivityDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, Activity, Exercise, Park } from '@prisma/client';
import { DifficultyType } from '@bregenz-bewegt/client/types';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async getFilterTimespans(userId: User['id']): Promise<number[]> {
    const { _min, _max } = await this.prismaService.activity
      .aggregate({
        where: {
          userId: userId,
        },
        _min: { endedAt: true },
        _max: { endedAt: true },
      })
      .then((data) => {
        return {
          _min: data._min.endedAt.getFullYear(),
          _max: data._max.endedAt.getFullYear(),
        };
      });
    return [...Array(_max - _min + 1).keys()].map((x) => _max - x);
  }

  async getAll(
    userId: User['id'],
    options?: ActivityPaginationQueryDto
  ): Promise<
    (Activity & {
      park: Park;
      exercise: Exercise & { difficulty: DifficultyType };
    })[]
  > {
    const activities = await this.prismaService.activity.findMany({
      where: {
        ...(options.year
          ? {
              AND: [
                {
                  userId: userId,
                },
                {
                  endedAt: {
                    gte: new Date(options.year, 0, 1),
                  },
                },
                {
                  endedAt: {
                    lte: new Date(options.year, 11, 31),
                  },
                },
              ],
            }
          : { AND: [{ userId: userId }, { NOT: { endedAt: null } }] }),
      },
      include: {
        park: true,
        exercise: {
          include: { difficulty: true },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
      ...(options?.skip ? { skip: options.skip } : {}),
      ...(options?.take ? { take: options.take } : {}),
    });

    return activities.map((a) => ({
      ...a,
      exercise: { ...a.exercise, difficulty: a.exercise.difficulty.difficulty },
    })) as (Activity & {
      park: Park;
      exercise: Exercise & { difficulty: DifficultyType };
    })[];
  }

  async startActivity(userId: User['id'], dto: StartActivityDto) {
    return this.prismaService.activity.create({
      data: {
        user: { connect: { id: userId } },
        startedAt: new Date(),
        exercise: { connect: { id: dto.exerciseId } },
        park: { connect: { id: dto.parkId } },
      },
    });
  }

  async endActivity(dto: EndActivityDto) {
    return this.prismaService.activity.update({
      where: { id: dto.activityId },
      data: { endedAt: new Date() },
    });
  }
}
