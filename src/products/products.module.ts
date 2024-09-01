import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/products.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from '../email/email.module';
import { LastreadingModule } from 'src/lastreading/lastreading.module';
import { UsersreadingModule } from 'src/usersreading/usersreading.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/products', // Directorio donde se guardarán las imágenes
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
    UsersreadingModule,
    UserModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
