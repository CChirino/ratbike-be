import {
  Controller,
  Post,
  Body,
  Response,
  Res,
  UploadedFile,
  UseInterceptors,
  Patch,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Roles('public', 'admin', 'moderador', 'user')
  @UseInterceptors(FileInterceptor('urlProfileImage')) // Nombre del campo de archivo en la solicitud
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() userObject: RegisterAuthDto,
    @Res() response,
  ) {
    return await this.authService.register(userObject, file, response);
  }
  @Post('login')
  @Roles('public', 'admin', 'moderador', 'user')
  loginUser(@Body() userObjectLogin: LoginAuthDto, @Res() response) {
    return this.authService.login(userObjectLogin, response);
  }

  @Post('refresh-token')
  @Roles('public', 'admin', 'moderador', 'user')
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

  @Post('reset-password')
  @Roles('public', 'admin', 'moderador', 'user')
  async requestPasswordReset(@Body('email') email: string): Promise<void> {
    await this.authService.sendPasswordResetEmail(email);
  }

  @Patch('reset-password')
  @Roles('public', 'admin', 'moderador', 'user')
  async resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    await this.authService.resetPassword(email, newPassword, token, );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: any): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Bearer token is missing');
    }

    await this.authService.logout(token);
  }
}
