import { CreateCategoriesProductDto } from './dto/create-categories-product.dto';
import { UpdateCategoriesProductDto } from './dto/update-categories-product.dto';
import {
  CategoryProduct,
  CategoryProductDocument,
} from './schema/categories-products.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { UnexpectedException } from 'src/Unexpected.exception';

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
      let translation = null;
      translation = {
        translationNameCategoryProduct:
          createCategoryProductDto.translation.translationNameCategoryProduct,
      };
      const newCategoryProduct = new this.categoryProductModel({
        ...createCategoryProductDto,
        ...(translation && { translations: translation }),
      });
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
      const responseObj = {
        status: HttpStatus.CREATED,
        data: createdCategory,
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }
  async findAll(): Promise<{ status: number; data: CategoryProduct[] }> {
    try {
      const query = this.categoryProductModel.find({
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const data = await query.exec();

      const response: {
        status: number;
        data: CategoryProduct[];
      } = {
        status: HttpStatus.OK,
        data,
      };

      return response;
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async findOne(id: string): Promise<CategoryProduct> {
    try {
      return this.categoryProductModel.findById(id).exec();
    } catch (error) {
      throw new UnexpectedException(error);
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
      throw new UnexpectedException(error);
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
      throw new UnexpectedException(error);
    }
  }
}
