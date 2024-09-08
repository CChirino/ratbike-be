import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Product } from 'src/products/schema/products.schema';
import { Brotherhood } from 'src/brotherhood/schema/brotherhood.schema';
import { Wall } from 'src/wall/schema/wall.schema';
import { WallDocument } from 'src/wall/schema/wall.schema';
import { Skill } from 'src/skills/schema/skills.schema';
import { I18nService } from 'nestjs-i18n';
import { UnexpectedException } from 'src/Unexpected.exception';

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
      throw new UnexpectedException(error);
    }
  }

  async sendRegistrationConfirmation(
    email: string,
    name: string,
    lang: string = 'en',
  ) {
    try {
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
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }
  async sendPasswordResetRequest(
    email: string,
    resetUrl: string,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation('password_reset', lang, {
        resetUrl,
      });
      await this.mailerService.sendMail({
        to: email,
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendProductRequest(
    productId: string,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation('product_request', lang, {
        productId,
      });
      await this.mailerService.sendMail({
        to: 'RatWave1999@gmail.com',
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendApprovalEmail(
    email: string,
    product: Product,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation('product_approval', lang, {
        productName: product.nameProduct,
      });
      await this.mailerService.sendMail({
        to: email,
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendRejectionEmail(
    email: string,
    product: Product,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation('product_rejection', lang, {
        productName: product.nameProduct,
      });
      await this.mailerService.sendMail({
        to: email,
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendApprovalEmailBrotherhood(
    email: string,
    brotherhood: Brotherhood,
    lang: string = 'en',
  ): Promise<void> {
    try {
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
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendRejectionEmailBrotherhood(
    email: string,
    brotherhood: Brotherhood,
    lang: string = 'en',
  ): Promise<void> {
    try {
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
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendApprovalEmailWall(
    email: string,
    wallId: string,
    wall: Wall,
    lang: string = 'en',
  ): Promise<void> {
    const translation = await this.getTranslation('wall_approval', lang, {
      wallId,
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
    wallId: string,
    wall: Wall,
    lang: string = 'en',
  ): Promise<void> {
    const translation = await this.getTranslation('wall_rejection', lang, {
      wallName: wall.titleWall,
      wallRejectedReason: wall.rejectedReason,
      wallId,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendPostRequest(
    email: string,
    wallId: string,
    lang: string = 'en',
  ): Promise<void> {
    const translation = await this.getTranslation('post_request', lang, {
      wallId,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendPostRequestAdmin(
    email: string,
    wallId: string,
    lang: string = 'en',
  ): Promise<void> {
    const translation = await this.getTranslation('post_request_admin', lang, {
      email,
      wallId,
    });
    await this.mailerService.sendMail({
      to: 'RatWave1999@gmail.com',
      subject: translation.subject,
      html: translation.html,
    });
  }

  async sendPostRequestUpdate(
    wallId: string,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation(
        'post_request_update',
        lang,
        {
          wallId,
        },
      );
      await this.mailerService.sendMail({
        to: 'RatWave1999@gmail.com',
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendExpiredWallNotification(wall: WallDocument): Promise<void> {
    try {
      // Lógica para enviar el correo electrónico
      this.logger.log(
        `Enviando notificación de muro vencido: ${wall.titleWall}`,
      );
    } catch (error) {
      this.logger.error('Error al enviar notificación de muro vencido', error);
      throw new UnexpectedException(error);
    }
  }

  async sendApprovalEmailSkill(
    email: string,
    skill: Skill,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation('skill_approval', lang, {
        skillName: skill.titleSkill,
      });
      await this.mailerService.sendMail({
        to: email,
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendRejectionEmailSkill(
    email: string,
    skill: Skill,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation('skill_rejection', lang, {
        skillName: skill.titleSkill,
      });
      await this.mailerService.sendMail({
        to: email,
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendPostRequestSkill(
    skillId: string,
    lang: string = 'en',
  ): Promise<void> {
    try {
      const translation = await this.getTranslation('skill_request', lang, {
        skillId,
      });
      await this.mailerService.sendMail({
        to: 'RatWave1999@gmail.com',
        subject: translation.subject,
        html: translation.html,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async sendMailContact(
    mailOptions: { to: string; subject: string; text: string },
    lang: string = 'en',
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
      throw new UnexpectedException(error);
    }
  }
}
