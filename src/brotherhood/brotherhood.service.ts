import { CreateBrotherhoodDto } from './dto/create-brotherhood.dto';
import { UpdateBrotherhoodDto } from './dto/update-brotherhood.dto';
import { Brotherhood, BrotherhoodDocument } from './schema/brotherhood.schema';
import { EmailService } from '../email/email.service';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationResponse } from './interfaces/pagination.interface';
import { LastReadingService } from 'src/lastreading/lastreading.service';
import { UsersreadingService } from 'src/usersreading/usersreading.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class BrotherhoodService {
  constructor(
    @InjectModel(Brotherhood.name)
    private readonly brotherhoodModel: Model<BrotherhoodDocument>,
    private readonly emailService: EmailService,
    private lastReadingService: LastReadingService,
    private userReadingService: UsersreadingService,
    private usersService: UserService,
  ) {}

  async create(
    createBrotherhoodDto: CreateBrotherhoodDto,
    files: Express.Multer.File[],
    user: any,
    response,
  ): Promise<Brotherhood> {
    try {
      let translation = null;

      if (createBrotherhoodDto.translation) {
        const parsedTranslation = JSON.parse(createBrotherhoodDto.translation);

        translation = {
          translationNameProduct: parsedTranslation.translationName,
          translationDescriptionProduct:
            parsedTranslation.translationDescription,
        };
      }

      const newBrotherhood = new this.brotherhoodModel({
        ...createBrotherhoodDto,
        ...(translation && { translation }),
        status: 'revision',
        createdBy: user.name + ' ' + user.lastname,
      });

      if (files && files.length > 0) {
        const urlImageProduct = files[0].path.replace(/\\/g, '/');
        newBrotherhood.urlImageBrotherhood = urlImageProduct;
      } else {
        const defaultImagePath =
          'uploads/brotherhood/default-product-image.jpg';
        if (fs.existsSync(defaultImagePath)) {
          newBrotherhood.urlImageBrotherhood = defaultImagePath;
        }
      }

      if (files && files.length > 1) {
        const galleryImagesBrotherhood = files
          .slice(1)
          .map((file) => file.path.replace(/\\/g, '/'));
        newBrotherhood.galleryImagesBrotherhood = galleryImagesBrotherhood;
      }

      const createdBrotherhood = await newBrotherhood.save();

      const brotherhoodId = createdBrotherhood._id;

      //await this.emailService.sendProductRequest(brotherhoodId);

      const responseObj = {
        status: HttpStatus.OK,
        data: createdBrotherhood,
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
    user: any,
    page?: number,
    limit?: number,
    category?: string,
  ): Promise<{ status: number; data: PaginationResponse<Brotherhood> }> {
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

      let query = this.brotherhoodModel.find({
        $and: andQueryArray,
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const total = await this.brotherhoodModel.countDocuments({
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

      let lastReading = await this.lastReadingService.findOne();

      if (!lastReading) {
        // Crear un nuevo registro si no existe
        lastReading = await this.lastReadingService.create({
          news: null,
          brotherhood: new Date(),
          events: null,
          store: null,
          wall: null,
        });
      } else {
        // Actualizar el campo 'news' si el registro ya existe
        await this.lastReadingService.updateBrotherhood(
          lastReading._id.toString(),
          {
            brotherhood: new Date(),
          },
        );
      }

      await this.handleUserReading(user);

      const response: {
        status: number;
        data: PaginationResponse<Brotherhood>;
      } = {
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

  async findOne(
    id: string,
  ): Promise<{ status: number; brotherhood: Brotherhood }> {
    try {
      const brotherhood = await this.brotherhoodModel.findById(id).exec();
      return {
        status: HttpStatus.OK,
        brotherhood: brotherhood,
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
    updateBrotherhoodDto: UpdateBrotherhoodDto,
    user: any,
    files: Express.Multer.File[],
  ): Promise<Brotherhood> {
    try {
      const emailUser = user.email;

      let translation = null;

      if (updateBrotherhoodDto.translation) {
        const parsedTranslation = JSON.parse(updateBrotherhoodDto.translation);

        translation = {
          translationName: parsedTranslation.translationName,
          translationDescription: parsedTranslation.translationDescription,
        };
      }

      const updateData: any = {
        ...updateBrotherhoodDto,
        ...(translation && { translation }),
        update_at: new Date(),
      };

      // Buscar el objeto existente
      const existingBrotherhood = await this.brotherhoodModel
        .findById(id)
        .exec();
      if (!existingBrotherhood) {
        throw new HttpException('Brotherhood not found', HttpStatus.NOT_FOUND);
      }

      // Manejar archivos si se proporcionan
      if (files && files.length > 0) {
        const urlImageBrotherhood = files[0].path.replace(/\\/g, '/');
        updateData.urlImageBrotherhood = urlImageBrotherhood;
        updateData.galleryImagesBrotherhood = [
          ...(updateBrotherhoodDto.filesToKeep.length
            ? updateBrotherhoodDto.filesToKeep.split(',')
            : []),
        ];
        if (files.length > 1) {
          const galleryImagesBrotherhood = files.map((file) =>
            file.path.replace(/\\/g, '/'),
          );
          updateData.galleryImagesBrotherhood = [
            ...galleryImagesBrotherhood,
            ...(updateBrotherhoodDto.filesToKeep.length
              ? updateBrotherhoodDto.filesToKeep.split(',')
              : []),
          ];
        }
      } else {
        updateData.galleryImagesBrotherhood = [
          ...(updateBrotherhoodDto.filesToKeep.length
            ? updateBrotherhoodDto.filesToKeep.split(',')
            : []),
        ];
      }
      // Actualizar el objeto en la base de datos
      const updatedBrotherhood = await this.brotherhoodModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updatedBrotherhood) {
        throw new HttpException('Brotherhood not found', HttpStatus.NOT_FOUND);
      }

      // Enviar correos electrónicos si el estado ha cambiado
      // if (updatedBrotherhood.status === 'aprobado') {
      //   await this.emailService.sendApprovalEmailBrotherhood(
      //     emailUser,
      //     updatedBrotherhood,
      //   );
      // } else if (updatedBrotherhood.status === 'rechazado') {
      //   await this.emailService.sendRejectionEmailBrotherhood(
      //     emailUser,
      //     updatedBrotherhood,
      //   );
      // }

      return updatedBrotherhood;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, response): Promise<Brotherhood> {
    try {
      const brotherhood = await this.brotherhoodModel.findById(id).exec();

      if (!brotherhood)
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ status: 500, message: 'INTERNAL_SERVER_ERROR' });

      brotherhood.delete_at = new Date().toISOString();
      brotherhood.delete_date = new Date();
      await brotherhood.save();

      return response
        .status(HttpStatus.NO_CONTENT)
        .json({ status: 204, message: 'NO_CONTENT', data: brotherhood });
    } catch (error) {}
  }

  async findProductsByCategory(category: string): Promise<Brotherhood[]> {
    const brotherhood = await this.brotherhoodModel.find({ category }).exec();
    return brotherhood;
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
        brotherhood: new Date(),
      };

      if (!usersReading) {
        // Crear un nuevo registro si no existe
        usersReading = await this.userReadingService.create({
          userId,
          ...updateData,
          news: null,
          events: null,
          store: null,
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
