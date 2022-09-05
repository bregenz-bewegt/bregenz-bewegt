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

  sendPasswordResetMail(options: {
    to: ISendMailOptions['to'];
    resetToken: string;
  }) {
    console.log(options.resetToken);
    const resetLink = `${this.configService.get('NX_API_BASE_URL')}`;

    return this.mailerService.sendMail({
      to: options.to,
      subject: 'Passwort ändern',
      text: `Besuche den folgenden Link, um dein Passwort zu ändern: ${resetLink}. Der Link läuft in 15 Minuten ab.`,
    });
  }
}
