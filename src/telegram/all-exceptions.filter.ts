import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { UnexpectedException } from 'src/Unexpected.exception';

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

    const message = `Error: ${status}\n
    URL: ${request.url}\n
    Method: ${request.method}\n
    User: ${JSON.stringify(request.user || '')}\n
    Payload: ${JSON.stringify(request.body)}\n
    Message: ${JSON.stringify(exception)}\n
    `;

    process.env.NODE_ENV === 'production' &&
      exception instanceof UnexpectedException &&
      (await this.telegramService.sendErrorMessage(message));

    response.status(status).json({
      statusCode: status,
      message: 'An error occurred',
    });
  }
}
