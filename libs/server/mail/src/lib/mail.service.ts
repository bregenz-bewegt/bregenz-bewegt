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

  sendPasswordResetmail(options: {
    to: ISendMailOptions['to'];
    resetToken: string;
  }) {
    const resetLink = `${this.configService.get(
      'NX_CLIENT_BASE_URL'
    )}/reset-password/${options.resetToken}`;

    return this.mailerService.sendMail({
      to: options.to,
      subject: 'Passwort ändern',
      text: `Besuche den folgenden Link, um dein Passwort zu ändern: ${resetLink} Der Link läuft in 15 Minuten ab.`,
    });
  }

  sendOtpActivationMail(options: { to: ISendMailOptions['to']; otp: string }) {
    return this.mailerService.sendMail({
      to: options.to,
      subject: 'Bestätige deine E-Mail Adresse',
      text: `Dein Bestätigungscode lautet: ${options.otp}`,
    });
  }
}
