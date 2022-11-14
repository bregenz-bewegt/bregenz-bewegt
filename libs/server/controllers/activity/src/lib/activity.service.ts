import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, Activity, Exercise, Park } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async findAllInMonth(
    userId: User['id'],
    month: number
  ): Promise<(Activity & { park: Park; exercise: Exercise })[]> {
    if (!month || month > new Date().getMonth()) return [];
    return this.prismaService.activity.findMany({
      where: {
        AND: [
          {
            userId: userId,
          },
          {
            endedAt: { gte: new Date(new Date().getFullYear(), month, 1) },
          },
          {
            endedAt: { lte: new Date(new Date().getFullYear(), month, 31) },
          },
        ],
      },
      include: { park: true, exercise: true },
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
