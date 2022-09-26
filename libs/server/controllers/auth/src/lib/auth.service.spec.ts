import { UserService } from '@bregenz-bewegt/server-controllers-user';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MailService } from '@bregenz-bewegt/server/mail';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { MailerOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        PrismaService,
        JwtService,
        ConfigService,
        MulterService,
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
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
