import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.role) {
      // Verificar si el usuario y la propiedad role existen
      // Verificar los roles y retornar true o false según corresponda
      return user.role === 'admin' || user.role === 'moderador';
    }

    return false; // Si el usuario o la propiedad role son undefined, retornar false
  }
}
