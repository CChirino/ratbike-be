import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Module({
  providers: [TelegramService],
  exports: [TelegramService], // Exporta el servicio para que otros módulos puedan utilizarlo
})
export class TelegramModule {}
