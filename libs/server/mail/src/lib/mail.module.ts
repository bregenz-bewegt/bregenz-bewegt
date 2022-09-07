import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env['NX_MAIL_HOST'],
        port: +process.env['NX_MAIL_PORT'],
        secure: true,
        auth: {
          user: process.env['NX_MAIL_USER'],
          pass: process.env['NX_MAIL_PASSWORD'],
        },
      },
      defaults: {
        from: process.env['NX_MAIL_FROM'],
      },
      // template: {
      //   dir: __dirname + './templates',
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
