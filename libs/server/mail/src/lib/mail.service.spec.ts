import { MailerOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
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

    service = module.get(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
