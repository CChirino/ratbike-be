import { CreateCategoriesProductDto } from './dto/create-categories-product.dto';
import { UpdateCategoriesProductDto } from './dto/update-categories-product.dto';
import {
  CategoryProduct,
  CategoryProductDocument,
} from './schema/categories-products.schema';
import { PaginationResponse } from './interfaces/pagination.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';

@Injectable()
export class CategoryProductService {
  constructor(
    @InjectModel(CategoryProduct.name)
    private readonly categoryProductModel: Model<CategoryProductDocument>,
  ) {}
  async create(
    createCategoryProductDto: CreateCategoriesProductDto,
    file: Express.Multer.File,
    response,
  ): Promise<CategoryProduct> {
    try {
      const newCategoryProduct = new this.categoryProductModel(
        createCategoryProductDto,
      );
      if (file) {
        const urlImageCategory = file.path.replace(/\\/g, '/');
        newCategoryProduct.urlImageCategory = urlImageCategory;
      } else {
        const defaultImagePath = 'uploads/categories/default-product-image.jpg';
        if (fs.pathExistsSync(defaultImagePath)) {
          newCategoryProduct.urlImageCategory = defaultImagePath;
        }
      }
      const createdCategory = await newCategoryProduct.save();
      return response.status(HttpStatus.CREATED).json(createdCategory);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findAll(
    page?: number,
    limit?: number,
  ): Promise<{ status: number; data: PaginationResponse<CategoryProduct> }> {
    try {
      let query = this.categoryProductModel.find({
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      let totalPages = 1;

      if (page && limit) {
        const total = await this.categoryProductModel.countDocuments();

        totalPages = Math.ceil(total / limit);

        if (page < 1 || page > totalPages) {
          throw new HttpException(
            'Página fuera de rango',
            HttpStatus.BAD_REQUEST,
          );
        }

        const skipCount = (page - 1) * limit;
        query = query.skip(skipCount).limit(limit);
      }

      const data = await query.exec();
      const total = await this.categoryProductModel.countDocuments();

      const response: {
        status: number;
        data: PaginationResponse<CategoryProduct>;
      } = {
        status: HttpStatus.OK,
        data: {
          paginationData: {
            page: page || 1,
            limit: limit,
            total,
            totalPages,
          },
          data,
        },
      };

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<CategoryProduct> {
    try {
      return this.categoryProductModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateCategoryProductDto: UpdateCategoriesProductDto,
  ): Promise<CategoryProduct> {
    try {
      return this.categoryProductModel
        .findByIdAndUpdate(id, updateCategoryProductDto, { new: true })
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<CategoryProduct> {
    try {
      const productCategory = await this.categoryProductModel
        .findById(id)
        .exec();

      if (productCategory) {
        productCategory.delete_at = new Date().toISOString();
        productCategory.delete_date = new Date();
        await productCategory.save();
      }
      return productCategory;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
