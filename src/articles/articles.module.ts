import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from './schema/article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/articles', // Directorio donde se guardarán las imágenes
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
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
