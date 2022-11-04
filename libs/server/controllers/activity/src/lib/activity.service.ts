import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

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
