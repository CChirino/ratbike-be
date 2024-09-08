import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const lang = request.headers['Lang']; // Captura el valor del encabezado 'Lang'

    if (lang) {
      request.lang = lang; // Almacena el idioma en el objeto request
    }

    return next.handle();
  }
}
