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

  async sendPasswordResetRequest(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Restablecimiento de contraseña - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Restablecimiento de contraseña</title>
          </head>
          <body>
            <h1>Restablecer contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            <a href=http://localhost:3000/auth/reset-password/">Restablecer contraseña</a>
          </body>
        </html>
      `,
    });
  }
}
