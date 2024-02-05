import {
  Controller,
  Post,
  Body,
  Response,
  Res,
  UploadedFile,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('urlProfileImage')) // Nombre del campo de archivo en la solicitud
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() userObject: RegisterAuthDto,
  ) {
    if (file) {
      const urlProfileImage = file.path.replace(/\\/g, '/');
      userObject.urlProfileImage = urlProfileImage;
    } else {
      const defaultImagePath = 'uploads/profile/default-profile.jpg';
      if (fs.existsSync(defaultImagePath)) {
        userObject.urlProfileImage = defaultImagePath;
      }
    }
    return await this.authService.register(userObject);
  }
  @Post('login')
  loginUser(@Body() userObjectLogin: LoginAuthDto, @Res() response) {
    console.log({ body: userObjectLogin });
    return this.authService.login(userObjectLogin, response);
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

  @Post('reset-password')
  async requestPasswordReset(@Body('email') email: string): Promise<void> {
    await this.authService.sendPasswordResetEmail(email);
  }

  @Patch('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    await this.authService.resetPassword(email, newPassword);
  }
}
