import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/products.schema';
import { PaginationResponse } from './interfaces/pagination.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user: any,
    response,
  ): Promise<Product> {
    try {
      const translation = {
        translationNameProduct:
          createProductDto.translation.translationNameProduct,
        translationDescriptionProduct:
          createProductDto.translation.translationDescriptionProduct,
      };

      console.log(user);

      const newProduct = new this.productModel({
        ...createProductDto,
        translation,
        status: 'revision',
        createdBy: user.name + user.lastname,
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

      response.status(HttpStatus.CREATED).json(createdProduct);
      return createdProduct;
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
      throw error;
    }
  }
  async findAll(
    page?: number,
    limit?: number,
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

      let query = this.productModel.find({
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const total = await this.productModel.countDocuments({
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
  ): Promise<Product> {
    try {
      return this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();

      if (product) {
        product.delete_at = new Date().toISOString();
        product.delete_date = new Date();
        await product.save();
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}
