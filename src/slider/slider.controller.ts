import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createSliderDto: CreateSliderDto[],
    @Res() response,
    @Req() request: Request,
  ) {
    const user = request.user;
    return this.sliderService.create(createSliderDto, files, response, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.sliderService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.sliderService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Body() updateSliderDto: UpdateSliderDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response,
  ) {
    return this.sliderService.update(updateSliderDto, files, response);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.sliderService.remove(id);
  }
}
