import { CreateCategoriesArticleDto } from './dto/create-categories-article.dto';
import { UpdateCategoriesArticleDto } from './dto/update-categories-article.dto';
import {
  CategoryArticle,
  CategoryArticleDocument,
} from './schema/categories-articles.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';

@Injectable()
export class CategoriesArticlesService {
  constructor(
    @InjectModel(CategoryArticle.name)
    private readonly categoryArticleModel: Model<CategoryArticleDocument>,
  ) {}

  async create(
    createCategoriesArticleDto: CreateCategoriesArticleDto,
    file: Express.Multer.File,
    response,
  ): Promise<CategoryArticle> {
    try {
      let translation = null;
      translation = {
        translationNameCategoryArticle:
          createCategoriesArticleDto.translation.translationNameCategoryArticle,
      };
      const newCategoryArticle = new this.categoryArticleModel({
        ...createCategoriesArticleDto,
        ...(translation && { translations: translation }),
      });
      if (file) {
        const urlImageCategoryArticles = file.path.replace(/\\/g, '/');
        newCategoryArticle.urlImageCategoryArticles = urlImageCategoryArticles;
      } else {
        const defaultImagePath =
          'uploads/categories-articles/default-product-image.jpg';
        if (fs.pathExistsSync(defaultImagePath)) {
          newCategoryArticle.urlImageCategoryArticles = defaultImagePath;
        }
      }
      const createdCategory = await newCategoryArticle.save();
      const responseObj = {
        status: HttpStatus.CREATED,
        data: createdCategory,
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<{ status: number; data: CategoryArticle[] }> {
    try {
      const query = this.categoryArticleModel.find({
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const data = await query.exec();

      const response: {
        status: number;
        data: CategoryArticle[];
      } = {
        status: HttpStatus.OK,
        data,
      };

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<CategoryArticle> {
    try {
      return this.categoryArticleModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateCategoriesArticleDto: UpdateCategoriesArticleDto,
  ): Promise<CategoryArticle> {
    try {
      return this.categoryArticleModel
        .findByIdAndUpdate(id, updateCategoriesArticleDto, { new: true })
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<CategoryArticle> {
    try {
      const productArticle = await this.categoryArticleModel
        .findById(id)
        .exec();

      if (productArticle) {
        productArticle.delete_at = new Date().toISOString();
        productArticle.delete_date = new Date();
        await productArticle.save();
      }
      return productArticle;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
