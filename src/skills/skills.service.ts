import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill, SkillDocument } from './schema/skills.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import * as fs from 'fs';
import { PaginationResponse } from './interfaces/pagination.interface';
@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
  ) {}

  async create(
    createSkillDto: CreateSkillDto,
    files: Express.Multer.File[],
    user: any,
    response,
  ): Promise<Skill> {
    try {
      let translation = null;

      if (createSkillDto.translation) {
        translation = {
          translationTitleWall: createSkillDto.translation.translationTitleWall,
          translationDescriptionWall:
            createSkillDto.translation.translationDescriptionWall,
        };
      }

      const newSkill = new this.skillModel({
        ...createSkillDto,
        startDateWall: new Date(createSkillDto.startDateSkill),
        endDateWall: new Date(createSkillDto.endDateSkill),
        ...(translation && { translation }),
        status: 'revision',
        createdBy: user.name + ' ' + user.lastname,
      });

      if (files && files.length > 0) {
        const urlImageWall = files[0].path.replace(/\\/g, '/');
        newSkill.urlImageSkill = urlImageWall;
      } else {
        const defaultImagePath = 'uploads/wall/default-product-image.jpg';
        if (fs.existsSync(defaultImagePath)) {
          newSkill.urlImageSkill = defaultImagePath;
        }
      }

      if (files && files.length > 1) {
        const galleryImagesWall = files
          .slice(1)
          .map((file) => file.path.replace(/\\/g, '/'));
        newSkill.galleryImagesSkill = galleryImagesWall;
      }

      const createdSkill = await newSkill.save();

      const skillId = createdSkill._id;

      // await this.emailService.sendPostRequestSkill(skillId);

      const responseObj = {
        status: HttpStatus.OK,
        data: createdSkill,
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
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
    search?: string,
    countries?: string,
    wallStatus: string = 'aprobado',
  ): Promise<{ status: number; data: PaginationResponse<Skill> }> {
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

      const countriesArray = countries ? countries.split(',') : [];

      return this.findAllWithFilters(
        page,
        limit,
        search,
        countriesArray,
        wallStatus,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllWithFilters(
    page?: number,
    limit?: number,
    search?: string,
    countries?: string[],
    wallStatus: string = 'aprobado',
  ): Promise<{ status: number; data: PaginationResponse<Skill> }> {
    try {
      const defaultLimit = 20; // Límite predeterminado si no se proporciona el parámetro limit
      const actualLimit = limit || defaultLimit; // Determinar el límite actual a utilizar

      const query: any = {
        status: wallStatus,
        $or: [{ delete_at: null }, { delete_date: null }],
      };

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query['$or'] = [
          { 'translation.translationTitleSkill.en': searchRegex },
          { 'translation.translationDescriptionSkill.en': searchRegex },
        ];
        const languages = ['es', 'de', 'it', 'pt', 'fr'];
        languages.forEach((lang) => {
          query['$or'].push({
            [`translation.translationTitleSkill.${lang}`]: searchRegex,
          });
          query['$or'].push({
            [`translation.translationDescriptionSkill.${lang}`]: searchRegex,
          });
        });
      }

      if (countries && countries.length > 0) {
        query.locationWall = { $in: countries };
      }

      const total = await this.skillModel.countDocuments(query);
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

      let data: SkillDocument[];
      if (page) {
        const skipCount = (page - 1) * actualLimit;
        data = await this.skillModel
          .find(query)
          .skip(skipCount)
          .limit(actualLimit)
          .exec();
      } else {
        data = await this.skillModel.find(query).limit(actualLimit).exec();
      }

      const response: { status: number; data: PaginationResponse<Skill> } = {
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

  async findOne(id: string): Promise<{ status: number; skill: Skill }> {
    try {
      const skill = await this.skillModel.findById(id).exec();
      return {
        status: HttpStatus.OK,
        skill: skill,
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
    updateSkillDto: UpdateSkillDto,
    user: any,
    response,
  ): Promise<Skill> {
    try {
      const emailUser = user.email;
      const updatedSkill = await this.skillModel
        .findByIdAndUpdate(
          id,
          {
            ...UpdateSkillDto,
            update_at: new Date(), // Actualizar el campo update_at
          },
          { new: true },
        )
        .exec();

      if (!updatedSkill) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const responseObj = {
        status: HttpStatus.OK,
        data: updatedSkill,
      };

      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<Skill> {
    try {
      const skill = await this.skillModel.findById(id).exec();

      if (skill) {
        skill.delete_at = new Date().toISOString();
        skill.delete_date = new Date();
        await skill.save();
      }
      return skill;
    } catch (error) {
      throw error;
    }
  }
}
