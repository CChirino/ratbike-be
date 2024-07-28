import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Product } from 'src/products/schema/products.schema';
import { Brotherhood } from 'src/brotherhood/schema/brotherhood.schema';
import { Wall } from 'src/wall/schema/wall.schema';
import { WallDocument } from 'src/wall/schema/wall.schema';
import { Skill } from 'src/skills/schema/skills.schema';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly i18n: I18nService,
  ) {}

  private readonly logger = new Logger(EmailService.name);

  private async getTranslation(
    key: string,
    lang: string,
    variables: Record<string, any> = {},
  ) {
    try {
      // Determinar la URL del frontend basada en el entorno
      const frontendUrl =
        process.env.NODE_ENV === 'production'
          ? process.env.PROD_FRONTEND_URL
          : process.env.DEV_FRONTEND_URL;

      // Agregar la URL a las variables de traducción
      variables.url = frontendUrl;

      const subject = await this.i18n.translate(`${key}.subject`, {
        lang,
        args: variables,
      });
      const html = await this.i18n.translate(`${key}.html`, {
        lang,
        args: variables,
      });

      this.logger.log(`Translation for ${key}: ${subject}, ${html}`);

      return {
        subject,
        html,
      };
    } catch (error) {
      this.logger.error(`Error getting translation for ${key}`, error);
      throw error;
    }
  }

  async sendRegistrationConfirmation(
    email: string,
    name: string,
    lang: string = 'es',
  ) {
    const translation = await this.getTranslation(
      'registration_confirmation',
      lang,
      { name },
    );
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }
  async sendPasswordResetRequest(
    email: string,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('password_reset', lang);
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendProductRequest(
    productId: string,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('product_request', lang, {
      productId,
    });
    await this.mailerService.sendMail({
      to: 'angeldchz@gmail.com',
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendApprovalEmail(
    email: string,
    product: Product,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('product_approval', lang, {
      productName: product.nameProduct,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendRejectionEmail(
    email: string,
    product: Product,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('product_rejection', lang, {
      productName: product.nameProduct,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendApprovalEmailBrotherhood(
    email: string,
    brotherhood: Brotherhood,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation(
      'brotherhood_approval',
      lang,
      {
        brotherhoodName: brotherhood.nameBrotherhood,
      },
    );
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendRejectionEmailBrotherhood(
    email: string,
    brotherhood: Brotherhood,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation(
      'brotherhood_rejection',
      lang,
      {
        brotherhoodName: brotherhood.nameBrotherhood,
      },
    );
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendApprovalEmailWall(
    email: string,
    wall: Wall,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('wall_approval', lang, {
      wallName: wall.titleWall,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendRejectionEmailWall(
    email: string,
    wall: Wall,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('wall_rejection', lang, {
      wallName: wall.titleWall,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendPostRequest(wallId: string, lang: string = 'es'): Promise<void> {
    const translation = await this.getTranslation('post_request', lang, {
      wallId,
    });
    await this.mailerService.sendMail({
      to: 'angeldchz@gmail.com',
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendPostRequestUpdate(
    wallId: string,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('post_request_update', lang, {
      wallId,
    });
    await this.mailerService.sendMail({
      to: 'angeldchz@gmail.com',
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendExpiredWallNotification(wall: WallDocument): Promise<void> {
    try {
      // Lógica para enviar el correo electrónico
      this.logger.log(
        `Enviando notificación de muro vencido: ${wall.titleWall}`,
      );
    } catch (error) {
      this.logger.error('Error al enviar notificación de muro vencido', error);
    }
  }

  async sendApprovalEmailSkill(
    email: string,
    skill: Skill,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('skill_approval', lang, {
      skillName: skill.titleSkill,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendRejectionEmailSkill(
    email: string,
    skill: Skill,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('skill_rejection', lang, {
      skillName: skill.titleSkill,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendPostRequestSkill(
    skillId: string,
    lang: string = 'es',
  ): Promise<void> {
    const translation = await this.getTranslation('skill_request', lang, {
      skillId,
    });
    await this.mailerService.sendMail({
      to: 'angeldchz@gmail.com',
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendMailContact(
    mailOptions: { to: string; subject: string; text: string },
    lang: string = 'es',
  ) {
    const translation = await this.getTranslation('contact', lang, {
      text: mailOptions.text,
    });
    try {
      await this.mailerService.sendMail({
        to: mailOptions.to,
        subject: translation.subject,
        html: translation.html,
      });
      this.logger.log(`Email sent to ${mailOptions.to}`);
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }
}
