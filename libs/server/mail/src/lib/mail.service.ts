import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
      template: 'change-password',
      context: {
        name: options.name,
        link: resetLink,
        year: new Date().getFullYear(),
      },
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
      template: 'activate-mail',
      context: {
        name: options.name,
        code: options.otp,
        year: new Date().getFullYear(),
      },
    });
  }
}
