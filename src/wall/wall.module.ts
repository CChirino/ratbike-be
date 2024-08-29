import { Module } from '@nestjs/common';
import { WallService } from './wall.service';
import { WallController } from './wall.controller';
import { Wall, WallSchema } from './schema/wall.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EmailModule } from '../email/email.module';
import { LastreadingModule } from 'src/lastreading/lastreading.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Wall.name,
        schema: WallSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/wall', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.mimetype.split('/')[1].replace('+xml', ''); // Obtener la extensión del archivo
          callback(null, `${uniqueSuffix}.${extension}`);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB en bytes
        fieldSize: 100 * 1024 * 1024, // 100 MB en bytes
      },
    }),
    EmailModule,
    LastreadingModule,
  ],
  controllers: [WallController],
  providers: [WallService],
  exports: [WallService],
})
export class WallModule {}
