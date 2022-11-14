import { ActivityPaginationQueryDto } from './../../../../../shared/types/src/lib/dto/activity/activity-pagination.dto';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, Activity, Exercise, Park } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async getAll(
    userId: User['id'],
    options?: ActivityPaginationQueryDto
  ): Promise<(Activity & { park: Park; exercise: Exercise })[]> {
    const { _min, _max } = await this.prismaService.activity.aggregate({
      _min: { endedAt: true },
      _max: { endedAt: true },
    });

    return this.prismaService.activity.findMany({
      where: {
        AND: [
          {
            userId: userId,
          },
          {
            endedAt: {
              gte: new Date(options.year ?? _min.endedAt.getFullYear(), 0, 1),
            },
          },
          {
            endedAt: {
              lte: new Date(options.year ?? _max.endedAt.getFullYear(), 11, 31),
            },
          },
        ],
      },
      include: { park: true, exercise: true },
      ...(options?.skip ? { skip: options.skip } : {}),
      ...(options?.take ? { take: options.take } : {}),
    });
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
