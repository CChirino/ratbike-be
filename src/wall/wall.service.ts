import { CreateWallDto } from './dto/create-wall.dto';
import { UpdateWallDto } from './dto/update-wall.dto';
import { Wall, WallDocument } from './schema/wall.schema';
import { EmailService } from '../email/email.service';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationResponse } from './interfaces/pagination.interface';
import { LastReadingService } from 'src/lastreading/lastreading.service';
import { UsersreadingService } from 'src/usersreading/usersreading.service';
import { UserService } from 'src/user/user.service';
import { UnexpectedException } from 'src/Unexpected.exception';

@Injectable()
export class WallService {
  constructor(
    @InjectModel(Wall.name)
    private readonly wallModel: Model<WallDocument>,
    private readonly emailService: EmailService,
    private lastReadingService: LastReadingService,
    private userReadingService: UsersreadingService,
    private usersService: UserService,
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
        if (files.length > 1) {
          const galleryImagesWall = files.map((file) =>
            file.path.replace(/\\/g, '/'),
          );
          newWall.galleryImagesWall = galleryImagesWall;
        }
      } else {
        const defaultImagePath = 'uploads/wall/default-product-image.jpg';
        if (fs.existsSync(defaultImagePath)) {
          newWall.urlImageWall = defaultImagePath;
        }
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
      // response
      //   .status(HttpStatus.INTERNAL_SERVER_ERROR)
      //   .json({ error: error.message });
      // throw error;
    }
  }
  async findAll(
    user: any,
    page?: number,
    limit?: number,
    search?: string,
    skills?: string,
    countries?: string,
    wallStatus: string = 'aprobado',
    wallType?: string,
    wallModality?: string,
    ownerId?: string,
    showUpdatedOnly?: boolean,
    isPaid?: boolean 
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
        user,
        page,
        limit,
        search,
        skillsArray,
        countriesArray,
        wallStatus,
        wallType,
        wallModality,
        ownerId,
        showUpdatedOnly,
        isPaid
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async findOne(id: string): Promise<{ status: number; wall: Wall }> {
    try {
      const wall = await this.wallModel.findById(id).exec();

      if(!wall){
        throw new HttpException("WALL_NOT_FOUND", HttpStatus.NOT_FOUND)
      } 

      return {
        status: HttpStatus.OK,
        wall: wall,
      };
    } catch (error) {
      throw new UnexpectedException(error);
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async updateAll(
    id: string,
    updateWallDto: UpdateWallDto,
    files: Express.Multer.File[],
    user: any,
    response,
  ): Promise<Wall> {
    try {
      const updateData: any = {
        ...updateWallDto,
        status: 'revision',
        update_at: new Date(),
      };

      if (files && files.length > 0) {
        const urlImageWall = files[0].path.replace(/\\/g, '/');
        updateData.urlImageWall = urlImageWall;
        updateData.galleryImagesWall = [
          ...(updateWallDto.filesToKeep.length
            ? updateWallDto.filesToKeep.split(',')
            : []),
        ];
        if (files.length > 1) {
          const galleryImagesWall = files.map((file) =>
            file.path.replace(/\\/g, '/'),
          );
          updateData.galleryImagesWall = [
            ...galleryImagesWall,
            ...(updateWallDto.filesToKeep.length
              ? updateWallDto.filesToKeep.split(',')
              : []),
          ];
        }
      } else {
        updateData.galleryImagesWall = [
          ...(updateWallDto.filesToKeep.length
            ? updateWallDto.filesToKeep.split(',')
            : []),
        ];
      }

      const updatedWall = await this.wallModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updatedWall) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const wallId = updatedWall._id;

      await this.emailService.sendPostRequestUpdate(wallId);

      const responseObj = {
        status: HttpStatus.OK,
        data: updatedWall,
      };

      return response.status(HttpStatus.OK).json(responseObj);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async updateIsPaid(
    id: string,
    user: any,
    response,
  ): Promise<Wall> {
    try {
      const emailUser = user.email;
      const updatedWall = await this.wallModel
        .findByIdAndUpdate(
          id,
          {
            isPaid: true,
            update_at: new Date(), // Actualizar el campo update_at
          },
          { new: true },
        )
        .exec();

      if (!updatedWall) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      //TODO add email when the paid status is updated
      // await this.emailService.postItProcessCompleteEmail(emailUser, updatedWall);

      const responseObj = {
        status: HttpStatus.OK,
        data: updatedWall,
      };

      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async remove(id: string): Promise<Wall> {
    try {
      const wall = await this.wallModel.findById(id).exec();

      if (wall) {
        wall.delete_at = new Date().toISOString();
        wall.delete_date = new Date();
        await wall.save();
      }else{
        throw new HttpException("UNABLE_TO_GET_WALL", HttpStatus.NOT_FOUND)
        
      }
      return wall;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
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
    user: any,
    page?: number,
    limit?: number,
    search?: string,
    skills?: string[],
    countries?: string[],
    wallStatus: string = 'aprobado',
    wallType?: string,
    wallModality?: string,
    ownerId?: string,
    showUpdatedOnly: any = 'true',
    isPaid?: boolean
  ): Promise<{ status: number; data: PaginationResponse<Wall> }> {
    try {
      const defaultLimit = 20; // Límite predeterminado si no se proporciona el parámetro limit
      const actualLimit = limit || defaultLimit; // Determinar el límite actual a utilizar

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const query: any = {
        $or: [{ delete_at: null }, { delete_date: null }],
      };

      if (ownerId) {
        query.ownerId = { $in: [ownerId] };
        query.status = { $in: ['revision', 'aprobado', 'desaprobado'] };
      } else {
        if (showUpdatedOnly === 'true') {
          //se que parece una burrada, pero el queryparam llega como string, por eso toca hacer esto
          query.update_at = { $gte: oneMonthAgo };
        }
        query.status = { $in: [wallStatus] };
      }

      // if (ownerId) {
      //   query.ownerId = { $in: [ownerId] };
      // } else {
      //   if(!showUpdatedOnly){ //si está en false debería
      //     query.update_at = { $gte: oneMonthAgo };
      //   }
      //   query.status = {$in: [wallStatus]};
      // }

      if (wallStatus === 'desactualizado') {
        query.update_at = { $not: { $gte: oneMonthAgo } };
        query.status = { $in: ['revision', 'aprobado', 'desaprobado'] };
      }

      if(isPaid !== null){ //HAVENT TESTED THIS IF WE HAVE A BUG CHECK THIS FIRST
        query.isPaid = { $eq: isPaid }
      }

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

      if (wallModality === 'insitu') {
        if (countries && countries.length > 0) {
          query.locationWall = { $in: countries, $nin: ['remote'] };
        } else {
          query.locationWall = { $nin: ['remote'] };
        }
      } else if (wallModality === 'remote') {
        query.locationWall = { $in: ['remote'] };
      } else {
        if (countries && countries.length > 0) {
          query.locationWall = { $in: [...countries, 'remote'] };
        }
      }

      if (wallType === 'product') {
        query.type = { $in: wallType };
      } else if (wallType === 'skill') {
        query.type = { $in: wallType };
        if (skills && skills.length > 0) {
          query.skillWall = { $in: skills };
        }
      } else {
        if (skills && skills.length > 0) {
          query.skillWall = { $in: [...skills, undefined] };
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

      await this.handleUserReading(user);

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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }
  async findExpiredWalls(): Promise<WallDocument[]> {
    try{
      const expirationDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Hace 30 días
      return this.wallModel
        .find({
          status: 'aprobado',
          endDateWall: { $lt: expirationDate },
        })
        .exec();
    }catch(error){
      throw new UnexpectedException(error);
      
    }
  }

  async updateWallStatus(
    wallId: string,
    newStatus: string,
  ): Promise<WallDocument> {
    return this.wallModel
      .findByIdAndUpdate(wallId, { status: newStatus }, { new: true })
      .exec();
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
        wall: new Date(),
      };

      if (!usersReading) {
        // Crear un nuevo registro si no existe
        usersReading = await this.userReadingService.create({
          userId,
          ...updateData,
          news: null,
          brotherhood: null,
          events: null,
          store: null,
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }
}
