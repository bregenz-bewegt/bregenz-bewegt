import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options);
  }

  sendPasswordResetMail(options: ISendMailOptions) {
    return this.mailerService.sendMail({});
  }
}
