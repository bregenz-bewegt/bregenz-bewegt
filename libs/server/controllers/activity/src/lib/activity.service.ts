import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}

  async startActivity() {
    console.log('start');
  }

  async endActivity() {
    console.log('end');
  }
}
