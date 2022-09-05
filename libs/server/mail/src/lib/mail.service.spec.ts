import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailService, MailerService],
    }).compile();

    service = module.get(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
