import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MailService } from '@bregenz-bewegt/server/mail';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { UtilService } from '@bregenz-bewegt/server/util';
import { MailerOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        ConfigService,
        MulterService,
        UtilService,
        JwtService,
        MailService,
        MailerService,
        {
          name: 'MAILER_OPTIONS',
          provide: 'MAILER_OPTIONS',
          useValue: {
            transport: { connection: '' },
          } as MailerOptions,
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = module.get(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
