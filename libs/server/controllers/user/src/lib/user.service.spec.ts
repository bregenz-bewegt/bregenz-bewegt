import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { UtilService } from '@bregenz-bewegt/server/util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        ConfigService,
        MulterService,
        UtilService,
        JwtService,
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
