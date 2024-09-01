import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UsersReading,
  UsersReadingDocument,
} from './schema/usersreading.schema';
import { CreateUsersreadingDto } from './dto/create-usersreading.dto';
@Injectable()
export class UsersreadingService {
  constructor(
    @InjectModel(UsersReading.name)
    private userReadingModel: Model<UsersReadingDocument>,
  ) {}
  async findOneByUserId(userId: string): Promise<UsersReading> {
    try {
      const usersReading = await this.userReadingModel
        .findOne({ userId })
        .exec();
      return usersReading;
    } catch (error) {
      throw new HttpException(
        'Error al obtener el registro de lectura del usuario.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async create(
    createUsersreadingDto: CreateUsersreadingDto,
  ): Promise<UsersReading> {
    try {
      const createdRecord = new this.userReadingModel({
        ...createUsersreadingDto,
      });
      return await createdRecord.save();
    } catch (error) {
      throw new HttpException(
        `Error al crear el registro de lectura: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateReadingUsers(
    id: string,
    updateDto: Partial<UsersReading>,
  ): Promise<UsersReading | null> {
    try {
      const updatedUserReading = await this.userReadingModel
        .findByIdAndUpdate(
          id,
          { $set: updateDto },
          { new: true, runValidators: true }, // `new: true` devuelve el documento actualizado, `runValidators: true` asegura que se validen los datos.
        )
        .exec();
      return updatedUserReading;
    } catch (error) {
      throw new HttpException(
        `Error al actualizar el registro de lectura: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
