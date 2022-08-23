import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParkService {
  constructor(private prismaService: PrismaService) {}

  async getParks() {
    return this.prismaService.park.findMany();
  }
}
