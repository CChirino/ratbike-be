import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { SliderDocument, Slider } from './schema/slider.schema';

@Injectable()
export class SliderService {
  constructor(
    @InjectModel(Slider.name)
    private readonly sliderModel: Model<SliderDocument>,
  ) {}

  async create(
    createSliderDtos: CreateSliderDto[],
    files: Express.Multer.File[],
    response,
    user: any,
  ): Promise<Slider> {
    try {
      const documentsToUpload = createSliderDtos.map((createSliderDto: CreateSliderDto) => {
        const newSlider = new this.sliderModel({
          ...createSliderDto,
          createdBy: `${user.name} ${user.lastname}`,
        });
  
        let translation = null;
  
        if (createSliderDto.translation) {
          const parsedTranslation = JSON.parse(createSliderDto.translation);
          translation = {
            message:
              parsedTranslation.message,
          };
        }
  
        if (files && files.length > 0) {
          const image = files.map((file) => file.path.replace(/\\/g, '/'));
          newSlider.image = image;
        }

        return newSlider;
      });

      this.sliderModel.insertMany(documentsToUpload, {ordered: true})
      
      const responseObj = {
        status: HttpStatus.CREATED
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
      throw error;
    }
  }

  async findAll(): Promise<{ status: number; data: Slider[] }> {
    try {
      const sliders = await this.sliderModel.find().exec();
      return {
        status: HttpStatus.OK,
        data: sliders,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ status: number; data: Slider }> {
    try {
      const slider = await this.sliderModel.findById(id).exec();
      if (!slider) {
        throw new HttpException('Slider not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        data: slider,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateSliderDto: UpdateSliderDto,
    response,
  ): Promise<Slider> {
    try {
      const updatedSlider = await this.sliderModel
        .findByIdAndUpdate(id, updateSliderDto, { new: true })
        .exec();

      if (!updatedSlider) {
        throw new HttpException('Slider not found', HttpStatus.NOT_FOUND);
      }

      const responseObj = {
        status: HttpStatus.OK,
        data: updatedSlider,
      };
      return response.status(HttpStatus.OK).json(responseObj);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const slider = await this.sliderModel.findById(id).exec();
      if (!slider) {
        throw new HttpException('Slider not found', HttpStatus.NOT_FOUND);
      }

      slider.delete_at = new Date().toISOString();
      slider.delete_date = new Date();
      await slider.save();
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
