import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { Exercise, Park } from '@prisma/client';

@Injectable()
export class ExerciseService {
  constructor(private prismaService: PrismaService) {}

  findById(id: Exercise['id']): Promise<Exercise> {
    return this.prismaService.exercise.findUnique({ where: { id: id } });
  }

  async findByIdWithPark(
    id: Exercise['id']
  ): Promise<Exercise & { parks: Park[] }> {
    return await this.prismaService.exercise.findUnique({
      where: { id: id },
      include: { parks: true },
    });
  }
}
