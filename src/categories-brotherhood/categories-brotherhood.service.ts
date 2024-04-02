import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriesBrotherhoodDto } from './dto/create-categories-brotherhood.dto';
import { UpdateCategoriesBrotherhoodDto } from './dto/update-categories-brotherhood.dto';
import {
  CategoryBrotherhood,
  CategoryBrotherhoodDocument,
} from './schema/categories-brotherhood.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs-extra';

@Injectable()
export class CategoriesBrotherhoodService {
  constructor(
    @InjectModel(CategoryBrotherhood.name)
    private readonly categoryBrotherhoodModel: Model<CategoryBrotherhoodDocument>,
  ) {}
  async create(
    createCategoriesBrotherhoodDto: CreateCategoriesBrotherhoodDto,
    file: Express.Multer.File,
    response,
  ): Promise<CategoryBrotherhood> {
    try {
      let translation = null;
      translation = {
        translationNameCategoryProduct:
          createCategoriesBrotherhoodDto.translation
            .translationNameCategoryBrotherhood,
      };
      const newCategoryBrotherhood = new this.categoryBrotherhoodModel({
        ...createCategoriesBrotherhoodDto,
        ...(translation && { translations: translation }),
      });
      if (file) {
        const urlImageCategoryBrotherhood = file.path.replace(/\\/g, '/');
        newCategoryBrotherhood.urlImageCategoryBrotherhood =
          urlImageCategoryBrotherhood;
      } else {
        const defaultImagePath =
          'uploads/categories-brotherhood/default-product-image.jpg';
        if (fs.pathExistsSync(defaultImagePath)) {
          newCategoryBrotherhood.urlImageCategoryBrotherhood = defaultImagePath;
        }
      }
      const createdCategory = await newCategoryBrotherhood.save();
      const responseObj = {
        status: HttpStatus.CREATED,
        data: createdCategory,
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<{ status: number; data: CategoryBrotherhood[] }> {
    try {
      const query = this.categoryBrotherhoodModel.find({
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const data = await query.exec();

      const response: {
        status: number;
        data: CategoryBrotherhood[];
      } = {
        status: HttpStatus.OK,
        data,
      };
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<CategoryBrotherhood> {
    try {
      return this.categoryBrotherhoodModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateCategoriesBrotherhoodDto: UpdateCategoriesBrotherhoodDto,
  ): Promise<CategoryBrotherhood> {
    try {
      return this.categoryBrotherhoodModel
        .findByIdAndUpdate(id, updateCategoriesBrotherhoodDto, { new: true })
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<CategoryBrotherhood> {
    try {
      const brotherhoodCategory = await this.categoryBrotherhoodModel
        .findById(id)
        .exec();

      if (brotherhoodCategory) {
        brotherhoodCategory.delete_at = new Date().toISOString();
        brotherhoodCategory.delete_date = new Date();
        await brotherhoodCategory.save();
      }
      return brotherhoodCategory;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
