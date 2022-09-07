import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService, ConfigService, MulterService],
    }).compile();

    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
