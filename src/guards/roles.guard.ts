import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isAuthenticated: boolean;
    try {
      isAuthenticated = (await super.canActivate(context)) as boolean;
    } catch (err) {
      isAuthenticated = false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay roles definidos, significa que el endpoint está accesible para todos
    if (!roles) {
      return true;
    }

    // Permitir acceso a rutas públicas si el usuario no está autenticado
    if (!isAuthenticated) {
      if (roles.includes('public')) {
        return true;
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    // Verificar si el usuario tiene uno de los roles permitidos
    if (user && roles.includes(user.role)) {
      return true;
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
