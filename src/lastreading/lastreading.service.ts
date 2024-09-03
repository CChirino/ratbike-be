import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LastReading, LastReadingDocument } from './schema/lastreading.schema';
import { UpdateNewsDto } from './dto/UpdateNewsDto.dto';
import { UpdateBrotherhoodDto } from './dto/UpdateBrotherhoodDto.dto';
import { UpdateEventsDto } from './dto/UpdateEventsDto.dto';
import { UpdateWallDto } from './dto/UpdateWallDto.dto';
import { UpdateStoreDto } from './dto/UpdateStoreDto.dto';
import { CreateLastReadingDto } from './dto/create-lastreading.dto';
import { UnexpectedException } from 'src/Unexpected.exception';

@Injectable()
export class LastReadingService {
  constructor(
    @InjectModel(LastReading.name)
    private lastReadingModel: Model<LastReadingDocument>,
  ) {}

  async create(
    createLastReadingDto: CreateLastReadingDto,
  ): Promise<LastReading> {
    const createdLastReading = new this.lastReadingModel(createLastReadingDto);
    return createdLastReading.save();
  }

  async findOne(): Promise<LastReading> {
    try {
      const lastReading = await this.lastReadingModel.findOne().exec();
      if (!lastReading) {
        throw new HttpException(
          `Error al crear el registro de lectura`,
          HttpStatus.NOT_FOUND,
        );
      }
      return lastReading;
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async updateNews(
    id: string,
    updateNewsDto: UpdateNewsDto,
  ): Promise<LastReading> {
    return this.updateField(id, 'news', updateNewsDto.news);
  }

  async updateBrotherhood(
    id: string,
    updateBrotherhoodDto: UpdateBrotherhoodDto,
  ): Promise<LastReading> {
    try {
      return this.updateField(
        id,
        'brotherhood',
        updateBrotherhoodDto.brotherhood,
      );
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async updateEvents(
    id: string,
    updateEventsDto: UpdateEventsDto,
  ): Promise<LastReading> {
    try {
      return this.updateField(id, 'events', updateEventsDto.events);
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async updateStore(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<LastReading> {
    try {
      return this.updateField(id, 'store', updateStoreDto.store);
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async updateWall(
    id: string,
    updateWallDto: UpdateWallDto,
  ): Promise<LastReading> {
    try {
      return this.updateField(id, 'wall', updateWallDto.wall);
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  private async updateField(
    id: string,
    field: string,
    value: Date,
  ): Promise<LastReading> {
    try {
      const lastReading = await this.lastReadingModel.findOne({ _id: id });

      if (!lastReading) {
        console.error('LastReading not found');
        throw new NotFoundException('LastReading not found');
      }

      lastReading[field] = value;
      const updated = await lastReading.save();
      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }
}
