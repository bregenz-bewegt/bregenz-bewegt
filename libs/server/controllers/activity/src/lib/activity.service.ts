import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async startActivity(userId: User['id'], dto: StartActivityDto) {
    this.prismaService.user.update({
      where: { id: userId },
      data: {
        activities: {
          create: [
            {
              exercise: { connect: { id: dto.exerciseId } },
              startedAt: new Date(),
            },
          ],
        },
      },
    });
  }

  async endActivity(userId: User['id'], dto: EndActivityDto) {
    console.log(userId, dto);
  }
}
