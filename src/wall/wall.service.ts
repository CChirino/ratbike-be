import { CreateWallDto } from './dto/create-wall.dto';
import { UpdateWallDto } from './dto/update-wall.dto';
import { Wall, WallDocument } from './schema/wall.schema';
import { EmailService } from '../email/email.service';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationResponse } from './interfaces/pagination.interface';

@Injectable()
export class WallService {
  constructor(
    @InjectModel(Wall.name)
    private readonly wallModel: Model<WallDocument>,
    private readonly emailService: EmailService,
  ) {}
  async create(
    createWallDto: CreateWallDto,
    files: Express.Multer.File[],
    user: any,
    response,
  ): Promise<Wall> {
    try {
      let translation = null;

      if (createWallDto.translation) {
        translation = {
          translationNameProduct:
            createWallDto.translation.translationTitleWall,
          translationDescriptionProduct:
            createWallDto.translation.translationDescriptionWall,
        };
      }

      const newWall = new this.wallModel({
        ...createWallDto,
        startDateWall: new Date(createWallDto.startDateWall),
        endDateWall: new Date(createWallDto.endDateWall),
        ...(translation && { translation }),
        status: 'revision',
        createdBy: user.name + ' ' + user.lastname,
      });

      if (files && files.length > 0) {
        const urlImageWall = files[0].path.replace(/\\/g, '/');
        newWall.urlImageWall = urlImageWall;
      } else {
        const defaultImagePath = 'uploads/wall/default-product-image.jpg';
        if (fs.existsSync(defaultImagePath)) {
          newWall.urlImageWall = defaultImagePath;
        }
      }

      if (files && files.length > 1) {
        const galleryImagesWall = files
          .slice(1)
          .map((file) => file.path.replace(/\\/g, '/'));
        newWall.galleryImagesWall = galleryImagesWall;
      }

      const createdWall = await newWall.save();

      const wallId = createdWall._id;

      await this.emailService.sendPostRequest(wallId);

      const responseObj = {
        status: HttpStatus.OK,
        data: createdWall,
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
    skills?: string,
  ): Promise<{ status: number; data: PaginationResponse<Wall> }> {
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

      if (!!skills) {
        andQueryArray.push({ skills: skills });
      }

      let query = this.wallModel.find({
        $and: andQueryArray,
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const total = await this.wallModel.countDocuments({
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

      const response: { status: number; data: PaginationResponse<Wall> } = {
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

  async findOne(id: string): Promise<{ status: number; wall: Wall }> {
    try {
      const wall = await this.wallModel.findById(id).exec();
      return {
        status: HttpStatus.OK,
        wall: wall,
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
    updateWallDto: UpdateWallDto,
    user: any,
    response,
  ): Promise<Wall> {
    try {
      const emailUser = user.email;
      const updatedWall = await this.wallModel
        .findByIdAndUpdate(id, updateWallDto, { new: true })
        .exec();

      if (!updatedWall) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      if (updatedWall.status === 'aprobado') {
        await this.emailService.sendApprovalEmailWall(emailUser, updatedWall);
      } else if (updatedWall.status === 'rechazado') {
        await this.emailService.sendRejectionEmailWall(emailUser, updatedWall);
      }

      const responseObj = {
        status: HttpStatus.OK,
        data: updatedWall,
      };

      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<Wall> {
    try {
      const wall = await this.wallModel.findById(id).exec();

      if (wall) {
        wall.delete_at = new Date().toISOString();
        wall.delete_date = new Date();
        await wall.save();
      }
      return wall;
    } catch (error) {
      throw error;
    }
  }
}
