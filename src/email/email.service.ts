import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegistrationConfirmation(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmación de registro - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Confirmación de registro</title>
          </head>
          <body>
            <h1>Bienvenido, ${name}!</h1>
            <p>Gracias por registrarte en nuestro sitio. Tu registro ha sido confirmado correctamente.</p>
          </body>
        </html>
      `,
    });
  }
}
