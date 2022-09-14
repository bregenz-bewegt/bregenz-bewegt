import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { Exercise } from '@prisma/client';

@Injectable()
export class ExerciseService {
  constructor(private prismaService: PrismaService) {}

  findById(id: Exercise['id']): Promise<Exercise> {
    return this.prismaService.exercise.findUnique({ where: { id: id } });
  }

  findByIdWithPark(id: Exercise['id']) {
    return this.prismaService.exercise.findUnique({
      where: { id: id },
      include: { parks: true },
    });
  }
}
