import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WallService } from 'src/wall/wall.service';
import { EmailService } from 'src/email/email.service';
import { UnexpectedException } from 'src/Unexpected.exception';
import { ImageService } from 'src/image/image.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor(
    private readonly wallService: WallService,
    private readonly emailService: EmailService,
    private readonly imageService: ImageService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Iniciando proceso de revisión de muros vencidos');
    await this.updateExpiredWalls();
  }

  async updateExpiredWalls() {
    try {
      const expiredWalls = await this.wallService.findExpiredWalls();
      for (const wall of expiredWalls) {
        await this.wallService.updateWallStatus(wall._id, 'desactualizado');
        await this.emailService.sendExpiredWallNotification(wall);
      }
    } catch (error) {
      this.logger.error('Error al actualizar muros vencidos', error);
      throw new UnexpectedException(error);
    }
  }

  async cleanupUnusedImages() {
    try {
      const dbImagePaths = await this.imageService.findAllImages(); // Obtener todas las imágenes de la base de datos

      const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      const serverImages = await fs.promises.readdir(uploadDir);

      const unusedImages = serverImages.filter(
        (image) =>
          !dbImagePaths.some(
            (dbImage) =>
              path.join(uploadDir, dbImage.path) ===
              path.join(uploadDir, image),
          ),
      );

      for (const image of unusedImages) {
        const imagePath = path.join(uploadDir, image);
        await fs.promises.unlink(imagePath);
        this.logger.log(`Imagen eliminada: ${image}`);
      }
    } catch (error) {
      this.logger.error('Error durante la limpieza de imágenes', error);
      throw new UnexpectedException(error);
    }
  }
}
