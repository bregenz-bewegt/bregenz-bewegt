import { UserService } from '@bregenz-bewegt/server-controllers-user';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MailService } from '@bregenz-bewegt/server/mail';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { UtilService } from '@bregenz-bewegt/server/util';
import { MailerOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
        UserService,
        MulterService,
        MailService,
        MailerService,
        UtilService,
        {
          name: 'MAILER_OPTIONS',
          provide: 'MAILER_OPTIONS',
          useValue: {
            transport: { connection: '' },
          } as MailerOptions,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
