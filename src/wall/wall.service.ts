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
    search?: string,
    skills?: string,
    countries?: string,
    wallStatus: string = 'aprobado',
    wallType?: string,
    wallModality?: string,
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

      const skillsArray = skills ? skills.split(',') : [];
      const countriesArray = countries ? countries.split(',') : [];

      return this.findAllWithFilters(
        page,
        limit,
        search,
        skillsArray,
        countriesArray,
        wallStatus,
        wallType,
        wallModality
      );
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
        .findByIdAndUpdate(
          id,
          {
            ...updateWallDto,
            update_at: new Date(), // Actualizar el campo update_at
          },
          { new: true },
        )
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

  async findRevision(
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

      const andQueryArray: any = [{ status: 'revision' }];

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
  async getWallsByCountry(
    user: any,
    response,
  ): Promise<{ status: number; data: Wall[] }> {
    try {
      const country = user.country;
      const walls = await this.wallModel.find({ locationWall: country }).exec();
      const responseData = {
        status: HttpStatus.OK,
        data: walls,
      };
      return responseData;
    } catch (error) {
      response.status(500).json({ error: 'Error interno del servidor' });
      // Puedes personalizar el mensaje de error según tus necesidades
    }
  }

  async getWallByTranslation(
    translationTitle: string,
    translationDescription: string,
  ): Promise<WallDocument[]> {
    try {
      const query = {};
      const languages = ['en', 'es', 'de', 'it', 'pt', 'fr'];

      languages.forEach((language) => {
        query[`translation.translationTitleWall.${language}`] = {
          $eq: translationTitle,
        };
        query[`translation.translationDescriptionWall.${language}`] = {
          $eq: translationDescription,
        };
      });

      const walls = await this.wallModel.find(query).exec();
      return walls;
    } catch (error) {
      throw new Error('No se pudo obtener respuesta.');
    }
  }

  async findAllWithFilters(
    page?: number,
    limit?: number,
    search?: string,
    skills?: string[],
    countries?: string[],
    wallStatus: string = 'aprobado',
    wallType?: string,
    wallModality?: string,
  ): Promise<{ status: number; data: PaginationResponse<Wall> }> {
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
          { 'translation.translationTitleWall.en': searchRegex },
          { 'translation.translationDescriptionWall.en': searchRegex },
        ];
        const languages = ['es', 'de', 'it', 'pt', 'fr'];
        languages.forEach((lang) => {
          query['$or'].push({
            [`translation.translationTitleWall.${lang}`]: searchRegex,
          });
          query['$or'].push({
            [`translation.translationDescriptionWall.${lang}`]: searchRegex,
          });
        });
      }

      

      //if modality is insitu and there are no countries selected, just remove remote results, otherwise, remove remote results and just fetch results from the selected countries
      //if modality is remote, ignore countries, just get the wall items which locationWall are 'remote'
      //if there is no modality selected it means that there are no restriction in modality, therefore, show remote locations and if there are countries, show those which coincide with selected countries, if there are no countries
      //    is like not having any query at all regarding the location
      if (wallModality === 'insitu'){
        if (countries && countries.length > 0) {
          query.locationWall = { $in: countries, $nin: ["remote"] };
        }else{
          query.locationWall = { $nin: ["remote"] };
        }
      }else if(wallModality === "remote"){
        query.locationWall = { $in: ["remote"] };
      }else{
        if (countries && countries.length > 0) {
          query.locationWall = { $in: [...countries, "remote"]};
        }
      }

      //if the type is product, we don't need to filter by skills type
      //if the type is skill, we need to filter by type and if there are skills we need to filter by type skill and the selected skills
      // if the product type doesn't exist means we wan't every type of products, however if there are skills selected needs to show products but also skills from the selected skill categories
      //    that's the reason of that undefined, it means, if the field doesn't exist (which would be a product because the skillWall field doesn't exists for products) or if the skill is among the selected skill category by the user
      if(wallType === 'product'){
        query.type = {$in: wallType}
      }else if(wallType === 'skill'){
        query.type = {$in: wallType}
        if (skills && skills.length > 0) {
          query.skillWall = { $in: skills };
        }
      }else{
        if (skills && skills.length > 0) {
          query.skillWall = { $in: [...skills, undefined]}
        }
       
      }

      const total = await this.wallModel.countDocuments(query);
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

      let data: WallDocument[];
      if (page) {
        const skipCount = (page - 1) * actualLimit;
        data = await this.wallModel
          .find(query)
          .skip(skipCount)
          .limit(actualLimit)
          .exec();
      } else {
        data = await this.wallModel.find(query).limit(actualLimit).exec();
      }

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
  async findExpiredWalls(): Promise<WallDocument[]> {
    const expirationDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Hace 30 días
    return this.wallModel
      .find({
        status: 'aprobado',
        endDateWall: { $lt: expirationDate },
      })
      .exec();
  }

  async updateWallStatus(
    wallId: string,
    newStatus: string,
  ): Promise<WallDocument> {
    return this.wallModel
      .findByIdAndUpdate(wallId, { status: newStatus }, { new: true })
      .exec();
  }
}
