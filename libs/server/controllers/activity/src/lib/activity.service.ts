import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  ActivityPaginationQueryDto,
  EndActivityDto,
  StartActivityDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, Activity, Exercise, Park } from '@prisma/client';
import {
  ActivityChartData,
  DifficultyType,
} from '@bregenz-bewegt/client/types';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async getAll(
    userId: User['id'],
    options: ActivityPaginationQueryDto
  ): Promise<
    (Activity & {
      park: Park;
      exercise: Exercise & { difficulty: DifficultyType };
    })[]
  > {
    const activities = await this.prismaService.activity.findMany({
      where: {
        AND: [{ userId: userId }, { NOT: { endedAt: null } }],
      },
      include: {
        park: true,
        exercise: {
          include: { difficulty: true },
        },
      },
      orderBy: {
        endedAt: 'desc',
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

  async getFilterTimespans(userId: User['id']): Promise<number[]> {
    const { _min, _max } = await this.prismaService.activity
      .aggregate({
        where: {
          AND: [
            {
              userId: userId,
            },
            {
              endedAt: {
                gte: new Date(new Date().getFullYear(), 0, 1),
              },
            },
            {
              endedAt: {
                lte: new Date(new Date().getFullYear(), 11, 31),
              },
            },
          ],
        },
        _min: { endedAt: true },
        _max: { endedAt: true },
      })
      .then((data) => {
        if (!data._max.endedAt || !data._min.endedAt)
          return { _max: null, _min: null };

        return {
          _min: data._min.endedAt.getMonth() + 1,
          _max: data._max.endedAt.getMonth() + 1,
        };
      });

    return _max && _min
      ? [...Array(_max - _min + 1)].map((_x, i) => _max - i)
      : [new Date().getMonth() + 1];
  }

  async getChartData(
    userId: User['id'],
    month: number
  ): Promise<ActivityChartData> {
    month = month - 1;
    if (month > 11 || month < 0) return [];
    const activities = await this.prismaService.activity.findMany({
      where: {
        AND: [
          {
            userId: userId,
          },
          {
            endedAt: {
              gte: new Date(new Date().getFullYear(), month, 1),
            },
          },
          {
            endedAt: {
              lte: new Date(new Date().getFullYear(), month, 31),
            },
          },
        ],
      },
      orderBy: {
        endedAt: 'asc',
      },
      select: {
        endedAt: true,
        exercise: {
          select: {
            coins: true,
          },
        },
      },
    });

    return activities.reduce((result, activity) => {
      const date = new Date(activity.endedAt.setHours(13, 0, 0, 0));
      const rIndex = result.findIndex((r) => r.date === date.getDate());
      rIndex > -1
        ? (result[rIndex].coins += activity.exercise.coins)
        : result.push({
            date: date.getDate(),
            coins: activity.exercise.coins,
          });
      return result;
    }, []);
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
