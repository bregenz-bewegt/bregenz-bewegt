import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  sendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options);
  }

  async sendPasswordResetmail(options: {
    to: ISendMailOptions['to'];
    resetToken: string;
    name: string;
  }): Promise<void> {
    const resetLink = `${this.configService.get(
      'NX_CLIENT_BASE_URL'
    )}/reset-password/${options.resetToken}`;

    await this.mailerService.sendMail({
      to: options.to,
      subject: 'Passwort ändern | Bregenz bewegt',
      // text: `Besuche den folgenden Link, um dein Passwort zu ändern: ${resetLink} Der Link läuft in 15 Minuten ab.`,
      template: 'changePw',
      context: { name: options.name, link: resetLink },
    });
  }

  sendOtpActivationMail(options: {
    to: ISendMailOptions['to'];
    otp: string;
    name: string;
  }) {
    return this.mailerService.sendMail({
      to: options.to,
      subject: 'E-Mail Adresse bestätigen | Bregenz bewegt',
      // text: `Dein Bestätigungscode lautet: ${options.otp}`,
      template: 'changePw',
      context: { name: options.name, code: options.otp },
    });
  }
}
