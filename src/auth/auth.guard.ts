import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Puedes realizar cualquier lógica personalizada aquí antes de llamar a canActivate del guardia padre

    // Por ejemplo, obtener el token de la solicitud
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    console.log(token);

    // Validar el token si es necesario
    if (token) {
      const payload = this.jwtService.verify(token);
      request.user = payload; // Establecer el usuario en la solicitud si es necesario
    }

    return super.canActivate(context);
  }
}
