import { Module } from '@nestjs/common';
import { SliderService } from './slider.service';
import { SliderController } from './slider.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import { Slider, SliderSchema } from './schema/slider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Slider.name,
        schema: SliderSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/slider', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.mimetype.split('/')[1].replace('+xml', ''); // Obtener la extensión del archivo
          callback(null, `${uniqueSuffix}.${extension}`);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB en bytes
      },
    }),
  ],
  controllers: [SliderController],
  providers: [SliderService],
})
export class SliderModule {}
