import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LastReading, LastReadingDocument } from './schema/lastreading.schema';
import { UpdateNewsDto } from './dto/UpdateNewsDto.dto';
import { UpdateBrotherhoodDto } from './dto/UpdateBrotherhoodDto.dto';
import { UpdateEventsDto } from './dto/UpdateEventsDto.dto';
import { UpdateWallDto } from './dto/UpdateWallDto.dto';
import { UpdateStoreDto } from './dto/UpdateStoreDto.dto';
import { CreateLastReadingDto } from './dto/create-lastreading.dto';

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
    return this.updateField(
      id,
      'brotherhood',
      updateBrotherhoodDto.brotherhood,
    );
  }

  async updateEvents(
    id: string,
    updateEventsDto: UpdateEventsDto,
  ): Promise<LastReading> {
    return this.updateField(id, 'events', updateEventsDto.events);
  }

  async updateStore(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<LastReading> {
    return this.updateField(id, 'store', updateStoreDto.store);
  }

  async updateWall(
    id: string,
    updateWallDto: UpdateWallDto,
  ): Promise<LastReading> {
    return this.updateField(id, 'wall', updateWallDto.wall);
  }

  private async updateField(
    id: string,
    field: string,
    value: Date,
  ): Promise<LastReading> {
    const lastReading = await this.lastReadingModel.findOne({ _id: id });

    if (!lastReading) {
      console.error('LastReading not found');
      throw new NotFoundException('LastReading not found');
    }

    lastReading[field] = value;
    const updated = await lastReading.save();
    return updated;
  }
}
