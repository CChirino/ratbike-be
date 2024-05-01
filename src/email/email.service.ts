import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Product } from 'src/products/schema/products.schema';
import { Brotherhood } from 'src/brotherhood/schema/brotherhood.schema';
import { Wall } from 'src/wall/schema/wall.schema';

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

  async sendProductRequest(productId: string): Promise<void> {
    await this.mailerService.sendMail({
      to: 'christopherchirinosj@gmail.com',
      subject: 'Producto en Revision - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Producto en Revision </title>
          </head>
          <body>
          <h1>Aprobar Producto</h1>
          <p>Se ha creado un producto nuevo, el cual requiere aprobacion y modificaciones en respecto al idioma.</p>
          <a href="http://localhost:3000/products/${productId}">Actualizar producto</a>
          </body>
        </html>
      `,
    });
  }

  async sendApprovalEmail(email: string, product: Product): Promise<void> {
    const productName = product.nameProduct;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Producto Aprobado - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Producto Aprobado</title>
          </head>
          <body>
            <h1>¡Felicidades!</h1>
            <p>Tu producto ${productName} ha sido aprobado.</p>
          </body>
        </html>
      `,
    });
  }

  async sendRejectionEmail(email: string, product: Product): Promise<void> {
    const productName = product.nameProduct;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Producto Rechazado - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Producto Rechazado</title>
          </head>
          <body>
          <h1>Lamentamos informarte</h1>
            <p>Tu producto ${productName} ha sido rechazado.</p>
          </body>
        </html>
      `,
    });
  }

  async sendApprovalEmailBrotherhood(
    email: string,
    brotherhood: Brotherhood,
  ): Promise<void> {
    const BrotherhoodName = brotherhood.nameBrotherhood;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Brotherhood Aprobado - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Producto Aprobado</title>
          </head>
          <body>
            <h1>¡Felicidades!</h1>
            <p>Tu producto ${BrotherhoodName} ha sido aprobado.</p>
          </body>
        </html>
      `,
    });
  }

  async sendRejectionEmailBrotherhood(
    email: string,
    brotherhood: Brotherhood,
  ): Promise<void> {
    const BrotherhoodName = brotherhood.nameBrotherhood;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Brotherhood Rechazado - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Producto Rechazado</title>
          </head>
          <body>
          <h1>Lamentamos informarte</h1>
            <p>Tu producto ${BrotherhoodName} ha sido rechazado.</p>
          </body>
        </html>
      `,
    });
  }
  async sendApprovalEmailWall(email: string, wall: Wall): Promise<void> {
    const wallName = wall.titleWall;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Post-it Wall Aprobado - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Post it Aprobado</title>
          </head>
          <body>
            <h1>¡Felicidades!</h1>
            <p>Tu Post-it ${wallName} ha sido aprobado.</p>
          </body>
        </html>
      `,
    });
  }

  async sendRejectionEmailWall(email: string, wall: Wall): Promise<void> {
    const wallName = wall.titleWall;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Brotherhood Rechazado - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Post-it Rechazado</title>
          </head>
          <body>
          <h1>Lamentamos informarte</h1>
            <p>Tu Post-it ${wallName} ha sido rechazado.</p>
          </body>
        </html>
      `,
    });
  }

  async sendPostRequest(wallId: string): Promise<void> {
    await this.mailerService.sendMail({
      to: 'christopherchirinosj@gmail.com',
      subject: 'Post-it en Revision - Rat Bikes',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Post-it en Revision </title>
          </head>
          <body>
          <h1>Post-it En revision </h1>
          <p>Se ha creado un Post-it nuevo, el cual requiere aprobacion y modificaciones en respecto al idioma.</p>
          <a href="http://localhost:3000/products/${wallId}">Actualizar producto</a>
          </body>
        </html>
      `,
    });
  }
}
