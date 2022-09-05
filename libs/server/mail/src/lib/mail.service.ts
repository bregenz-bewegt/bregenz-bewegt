import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options);
  }

  sendPasswordResetMail(options: {
    to: ISendMailOptions['to'];
    resetToken: string;
  }) {
    console.log(options.resetToken);
    const resetLink = ``;

    return this.mailerService.sendMail({
      to: options.to,
      subject: 'Passwort ändern',
      text: `Besuche den folgenden Link, um dein Passwort zu ändern: ${resetLink}. Der Link läuft in 15 Minuten ab.`,
    });
  }
}
