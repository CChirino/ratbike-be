import { Module } from '@nestjs/common';
import { CategoriesArticlesService } from './categories-articles.service';
import { CategoriesArticlesController } from './categories-articles.controller';
import {
  CategoryArticle,
  CategoryArticleSchema,
} from './schema/categories-articles.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CategoryArticle.name,
        schema: CategoryArticleSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/categories-articles', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.mimetype.split('/')[1].replace('+xml', ''); // Obtener la extensión del archivo
          callback(null, `${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  ],
  controllers: [CategoriesArticlesController],
  providers: [CategoriesArticlesService],
})
export class CategoriesArticlesModule {}
