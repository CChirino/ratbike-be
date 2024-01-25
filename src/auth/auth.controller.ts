import { Controller, Post, Body, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    console.log({ body: userObject });
    return this.authService.register(userObject);
  }

  @Post('login')
  loginUser(@Body() userObjectLogin: LoginAuthDto) {
    console.log({ body: userObjectLogin });
    return this.authService.login(userObjectLogin);
  }

  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Response() res: any) {
    const newAccessToken = this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    if (newAccessToken) {
      // Devolver el nuevo token en el cuerpo de la respuesta
      return res.status(200).json({ token: newAccessToken });
    } else {
      // Devolver un error o una respuesta indicando que el token no se pudo generar
      return res
        .status(500)
        .json({ message: 'No se pudo generar un nuevo token' });
    }
  }
}
