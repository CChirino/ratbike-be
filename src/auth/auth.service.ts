import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import fs from 'fs-extra';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(userObject: RegisterAuthDto): Promise<User> {
    const { password, urlProfileImage } = userObject;
    const plainToHash = await hash(password, 10);
    userObject = { ...userObject, password: plainToHash, urlProfileImage };

    const createdUser = await this.userModel.create(userObject);

    const data: User = {
      name: createdUser.name,
      lastname: createdUser.lastname,
      email: createdUser.email,
      password: createdUser.password,
      role: createdUser.role,
      country: createdUser.country,
      urlProfileImage: createdUser.urlProfileImage,
      delete_at: createdUser.delete_at,
      delete_date: createdUser.delete_date,
    };

    await this.emailService.sendRegistrationConfirmation(
      createdUser.email,
      createdUser.name,
    );

    return data;
  }
  async login(userObjectLogin: LoginAuthDto, response) {
    const { email, password } = userObjectLogin;
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) new HttpException('USER_NOT_FOUND', 404);

    const checkPassword = await compare(password, findUser.password);

    if (!checkPassword) throw new HttpException('PASSWORD_INVALID', 403);

    const payload = { id: findUser._id, name: findUser.name };
    const token = await this.jwtService.sign(payload);

    const data = {
      user: {
        id: findUser._id,
        name: findUser.name,
        lastname: findUser.lastname,
        email: findUser.email,
      },
      token,
    };

    response.status(HttpStatus.OK).json(data);
  }

  refreshToken(refreshToken: string): string {
    // Aquí puedes implementar la lógica de renovación del token según tus necesidades

    // Decodificar el token de actualización para obtener la información necesaria
    const decodedToken = this.jwtService.decode(refreshToken) as {
      id: string;
      name: string;
    };

    // Generar un nuevo token de acceso utilizando el id y nombre del usuario
    const newAccessToken = this.jwtService.sign({
      id: decodedToken.id,
      name: decodedToken.name,
    });

    return newAccessToken;
  }

  isRefreshTokenExpired(refreshToken: string): boolean {
    try {
      this.jwtService.verify(refreshToken);
      return false; // El token no está expirado
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return true; // El token está expirado
      }
      throw error;
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const imageBuffer = file.buffer; // Obtiene el búfer del archivo de imagen
    const imageName = `${Date.now()}-${file.originalname}`; // Genera un nombre único para el archivo
    const imagePath = `uploads/${imageName}`; // Ruta donde se guardará la imagen

    await fs.writeFile(imagePath, imageBuffer); // Guarda la imagen en el sistema de archivos

    // Elimina el archivo temporal después de guardarlo
    await fs.unlink(file.path);

    return imagePath; // Devuelve la ruta de la imagen guardada
  }
}
