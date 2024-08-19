import { Injectable } from '@nestjs/common';
import { TelegramBot } from 'typescript-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private chatId: string;
  constructor() {
    const botToken = '7106374452:AAEVtMcQnIbvaiqtUDq3Dcc6brWJOUpTyGo';
    this.chatId = '-4221294991';

    this.bot = new TelegramBot({ botToken });
  }

  async sendErrorMessage(message: string) {
    // Solo envía mensajes si el entorno es producción
    if (process.env.NODE_ENV === 'production') {
      try {
        await this.bot.sendMessage({
          chat_id: this.chatId,
          text: message,
        });
      } catch (error) {
        console.error('Failed to send message to Telegram:', error);
      }
    }
  }
}