import { Module } from '@nestjs/common';
import { CategoriesBrotherhoodService } from './categories-brotherhood.service';
import { CategoriesBrotherhoodController } from './categories-brotherhood.controller';
import {
  CategoryBrotherhood,
  CategoryBrotherhoodSchema,
} from './schema/categories-brotherhood.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CategoryBrotherhood.name,
        schema: CategoryBrotherhoodSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/categories-brotherhood', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.mimetype.split('/')[1].replace('+xml', ''); // Obtener la extensión del archivo
          callback(null, `${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  ],
  controllers: [CategoriesBrotherhoodController],
  providers: [CategoriesBrotherhoodService],
})
export class CategoriesBrotherhoodModule {}
