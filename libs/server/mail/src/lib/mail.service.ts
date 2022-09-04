import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendMail() {
    return this.mailerService.sendMail({
      to: 'simonostini@gmail.com',
      text: 'test',
    });
  }
}
