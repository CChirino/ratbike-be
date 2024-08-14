import { Injectable } from '@nestjs/common';
import { Telegram } from 'telegram-webhook-js';

@Injectable()
export class TelegramService {
  private telegram: Telegram;

  constructor() {
    // Configura tu bot y el webhook aquí
    const botToken = '7106374452:AAEVtMcQnIbvaiqtUDq3Dcc6brWJOUpTyGo';
    const chatId = -4221294991;

    this.telegram = new Telegram({
      botToken,
      chatId,
    });
  }

  async sendErrorMessage(message: string) {
    try {
      await this.telegram.sendMessage(message);
    } catch (error) {
      console.error('Failed to send message to Telegram:', error);
    }
  }
}
