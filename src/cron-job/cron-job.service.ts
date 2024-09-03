import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WallService } from 'src/wall/wall.service';
import { EmailService } from 'src/email/email.service';
import { UnexpectedException } from 'src/Unexpected.exception';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor(
    private readonly wallService: WallService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Iniciando proceso de revisión de muros vencidos');
    await this.updateExpiredWalls();
  }

  async updateExpiredWalls() {
    try {
      0;
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
}
