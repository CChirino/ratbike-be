import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { RefreshTokenMiddleware } from './middleware/refreshToken.middleware';
import { EmailModule } from '../email/email.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    EmailModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/profile', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.mimetype.split('/')[1]; // Obtener la extensión del archivo
          callback(null, `${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('auth/refresh-token');
  }
}
