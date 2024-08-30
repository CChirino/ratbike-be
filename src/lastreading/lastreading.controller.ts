import { Controller, Patch, Body, Param, Post } from '@nestjs/common';
import { LastReadingService } from './lastreading.service';
import { UpdateNewsDto } from './dto/UpdateNewsDto.dto';
import { UpdateBrotherhoodDto } from './dto/UpdateBrotherhoodDto.dto';
import { UpdateEventsDto } from './dto/UpdateEventsDto.dto';
import { UpdateWallDto } from './dto/UpdateWallDto.dto';
import { UpdateStoreDto } from './dto/UpdateStoreDto.dto';
import { CreateLastReadingDto } from './dto/create-lastreading.dto';

@Controller('last-reading')
export class LastReadingController {
  constructor(private readonly lastReadingService: LastReadingService) {}

  @Patch(':id/news')
  async updateNews(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.lastReadingService.updateNews(id, updateNewsDto);
  }

  @Patch(':id/brotherhood')
  async updateBrotherhood(
    @Param('id') id: string,
    @Body() updateBrotherhoodDto: UpdateBrotherhoodDto,
  ) {
    return this.lastReadingService.updateBrotherhood(id, updateBrotherhoodDto);
  }

  @Patch(':id/events')
  async updateEvents(
    @Param('id') id: string,
    @Body() updateEventsDto: UpdateEventsDto,
  ) {
    return this.lastReadingService.updateEvents(id, updateEventsDto);
  }

  @Patch(':id/store')
  async updateStore(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.lastReadingService.updateStore(id, updateStoreDto);
  }

  @Patch(':id/wall')
  async updateWall(
    @Param('id') id: string,
    @Body() updateWallDto: UpdateWallDto,
  ) {
    return this.lastReadingService.updateWall(id, updateWallDto);
  }

  @Post()
  async create(@Body() createLastReadingDto: CreateLastReadingDto) {
    return this.lastReadingService.create(createLastReadingDto);
  }
}
