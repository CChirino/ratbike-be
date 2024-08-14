import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly telegramService: TelegramService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message = `Error: ${status}\nURL: ${request.url}\nMethod: ${request.method}\nMessage: ${exception instanceof Error ? exception.message : 'Unknown error'}`;

    await this.telegramService.sendErrorMessage(message);

    response.status(status).json({
      statusCode: status,
      message: 'An error occurred',
    });
  }
}
