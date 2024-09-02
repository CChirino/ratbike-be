import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/products.schema';
import { PaginationResponse } from './interfaces/pagination.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { EmailService } from '../email/email.service';
import { LastReadingService } from 'src/lastreading/lastreading.service';
import { UsersreadingService } from 'src/usersreading/usersreading.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly emailService: EmailService,
    private lastReadingService: LastReadingService,
    private userReadingService: UsersreadingService,
    private usersService: UserService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user: any,
    response,
  ): Promise<Product> {
    try {
      let translation = null;

      if (createProductDto.translation) {
        const parsedTranslation = JSON.parse(createProductDto.translation);

        translation = {
          translationNameProduct: parsedTranslation.translationNameProduct,
          translationDescriptionProduct:
            parsedTranslation.translationDescriptionProduct,
        };
      }

      const newProduct = new this.productModel({
        ...createProductDto,
        ...(translation && { translation }),
        status: 'aprobado',
        createdBy: user.name + ' ' + user.lastname,
      });

      if (files && files.length > 0) {
        const urlImageProduct = files[0].path.replace(/\\/g, '/');
        newProduct.urlImageProduct = urlImageProduct;
      } else {
        const defaultImagePath = 'uploads/products/default-product-image.jpg';
        if (fs.existsSync(defaultImagePath)) {
          newProduct.urlImageProduct = defaultImagePath;
        }
      }

      if (files && files.length > 1) {
        const galleryImages = files
          .slice(1)
          .map((file) => file.path.replace(/\\/g, '/'));
        newProduct.galleryImages = galleryImages;
      }

      const createdProduct = await newProduct.save();

      const productId = createdProduct._id;

      //await this.emailService.sendProductRequest(productId);

      const responseObj = {
        status: HttpStatus.OK,
        data: createdProduct,
      };

      let lastReading = await this.lastReadingService.findOne();

      if (!lastReading) {
        // Crear un nuevo registro si no existe
        lastReading = await this.lastReadingService.create({
          news: null,
          brotherhood: null,
          events: null,
          store: new Date(),
          wall: null,
        });
      } else {
        // Actualizar el campo 'news' si el registro ya existe
        await this.lastReadingService.updateStore(lastReading._id.toString(), {
          store: new Date(),
        });
      }

      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
      throw error;
    }
  }
  async findAll(
    user: any,
    page?: number,
    limit?: number,
    category?: string,
  ): Promise<{ status: number; data: PaginationResponse<Product> }> {
    try {
      page = page && parseInt(page.toString(), 10);
      limit = limit && parseInt(limit.toString(), 10);

      if (page && (isNaN(page) || page < 1)) {
        throw new HttpException(
          'El parámetro "page" debe ser un número entero positivo.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (limit && (isNaN(limit) || limit < 1)) {
        throw new HttpException(
          'El parámetro "limit" debe ser un número entero positivo.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const defaultLimit = 20; // Límite predeterminado si no se proporciona el parámetro limit
      const actualLimit = limit || defaultLimit; // Determinar el límite actual a utilizar

      const andQueryArray: any = [{ status: 'aprobado' }];

      if (!!category) {
        andQueryArray.push({ category: category });
      }

      let query = this.productModel.find({
        $and: andQueryArray,
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const total = await this.productModel.countDocuments({
        $and: andQueryArray,
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const totalPages = Math.ceil(total / actualLimit);

      if (totalPages === 0) {
        throw new HttpException(
          'No se encontraron resultados.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (page && (page < 1 || page > totalPages)) {
        throw new HttpException(
          'Página fuera de rango.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (page) {
        const skipCount = (page - 1) * actualLimit;
        query = query.skip(skipCount).limit(actualLimit);
      } else {
        query = query.limit(actualLimit);
      }

      const data = await query.exec();

      await this.handleUserReading(user);

      const response: { status: number; data: PaginationResponse<Product> } = {
        status: HttpStatus.OK,
        data: {
          paginationData: {
            page: page || 1,
            limit: actualLimit,
            total,
            totalPages,
          },
          data,
        },
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
  async findOne(id: string): Promise<{ status: number; product: Product }> {
    try {
      const product = await this.productModel.findById(id).exec();
      return {
        status: HttpStatus.OK,
        product: product,
      };
    } catch (error) {
      // Manejo del error
      const errorMessage = error.message || 'Error interno del servidor';
      const errorResponse = {
        error: errorMessage,
      };
      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: any,
    response,
    files: Express.Multer.File[],
  ): Promise<Product> {
    try {
      const emailUser = user.email;

      // Manejar la traducción
      let translation = null;
      if (updateProductDto.translation) {
        const parsedTranslation = JSON.parse(updateProductDto.translation);

        translation = {
          translationNameProduct: parsedTranslation.translationNameProduct,
          translationDescriptionProduct:
            parsedTranslation.translationDescriptionProduct,
        };
      }

      // Preparar los datos para la actualización
      const updateData: any = {
        ...updateProductDto,
        ...(translation && { translation }),
        update_at: new Date(),
      };

      // Manejar archivos si se proporcionan
      if (files && files.length > 0) {
        const urlImageProduct = files[0].path.replace(/\\/g, '/');
        updateData.urlImageProduct = urlImageProduct;
        updateData.galleryImages = [
          ...(updateProductDto.filesToKeep.length
            ? updateProductDto.filesToKeep.split(',')
            : []),
        ];
        if (files.length > 1) {
          const galleryImages = files.map((file) =>
            file.path.replace(/\\/g, '/'),
          );
          updateData.galleryImagesWall = [
            ...galleryImages,
            ...(updateProductDto.filesToKeep.length
              ? updateProductDto.filesToKeep.split(',')
              : []),
          ];
        }
      } else {
        updateData.galleryImages = [
          ...(updateProductDto.filesToKeep.length
            ? updateProductDto.filesToKeep.split(',')
            : []),
        ];
      }

      // Actualizar el objeto en la base de datos
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updatedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      // Enviar correos electrónicos si el estado ha cambiado
      // if (updateProductDto.status === 'aprobado') {
      //   await this.emailService.sendApprovalEmail(emailUser, updatedProduct);
      // } else if (updateProductDto.status === 'rechazado') {
      //   await this.emailService.sendRejectionEmail(emailUser, updatedProduct);
      // }

      // Responder con el objeto actualizado
      const responseObj = {
        status: HttpStatus.OK,
        data: updatedProduct,
      };

      return response.status(HttpStatus.OK).json(responseObj);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, response): Promise<any> {
    try {
      const product = await this.productModel.findById(id).exec();

      if (!product) {
        // Si el producto no se encuentra, devolver una respuesta 404
        return response.status(HttpStatus.NOT_FOUND).json({
          status: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        });
      }

      // Marcar el producto para eliminación
      product.delete_at = new Date().toISOString();
      product.delete_date = new Date();
      await product.save();

      // Devolver una respuesta 200 con el estado del producto actualizado
      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Product marked for deletion',
        data: product,
      });
    } catch (error) {
      // Manejo de errores
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  async findProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.productModel.find({ category }).exec();
    return products;
  }

  private async handleUserReading(user: any): Promise<void> {
    try {
      // Buscar el ID del usuario por su correo electrónico
      const userId = await this.usersService.findUserIdByEmail(user.email);

      if (!userId) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      // Buscar el registro de lectura del usuario
      let usersReading = await this.userReadingService.findOneByUserId(userId);

      // Datos a utilizar para la creación o actualización
      const updateData = {
        store: new Date(),
      };

      if (!usersReading) {
        // Crear un nuevo registro si no existe
        usersReading = await this.userReadingService.create({
          userId,
          ...updateData,
          news: null,
          brotherhood: null,
          events: null,
          wall: null,
        });
      } else {
        // Verifica que el registro exista antes de actualizar
        if (!usersReading._id) {
          throw new HttpException(
            'Registro de lectura del usuario no válido.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        // Actualizar el campo 'news' si el registro ya existe
        await this.userReadingService.updateReadingUsers(
          usersReading._id.toString(), // Verifica que `_id` esté presente en el documento.
          updateData,
        );
      }
    } catch (error) {
      // Manejar errores
      console.error(
        'Error al manejar el registro de lectura del usuario:',
        error,
      );
      throw error;
    }
  }
}
