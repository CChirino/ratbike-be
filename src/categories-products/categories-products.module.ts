import { Module } from '@nestjs/common';
import { CategoryProductService } from './categories-products.service';
import { CategoriesProductsController } from './categories-products.controller';
import {
  CategoryProduct,
  CategoryProductSchema,
} from './schema/categories-products.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CategoryProduct.name,
        schema: CategoryProductSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/categories', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.mimetype.split('/')[1].replace("+xml", ""); // Obtener la extensión del archivo
          callback(null, `${uniqueSuffix}.${extension}`);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB en bytes
        fieldSize: 100 * 1024 * 1024, // 100 MB en bytes
      },
    }),
  ],
  controllers: [CategoriesProductsController],
  providers: [CategoryProductService],
})
export class CategoriesProductsModule {}
