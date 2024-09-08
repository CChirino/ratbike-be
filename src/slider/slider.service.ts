import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { SliderDocument, Slider } from './schema/slider.schema';
import { UnexpectedException } from 'src/Unexpected.exception';

@Injectable()
export class SliderService {
  constructor(
    @InjectModel(Slider.name)
    private readonly sliderModel: Model<SliderDocument>,
  ) {}

  async create(
    createSliderDtos: CreateSliderDto[] | any,
    files: Express.Multer.File[],
    response,
    user: any,
  ): Promise<Slider> {
    try {
      let documentsToUpload = [];
      for (
        let index = 0;
        index < Number(createSliderDtos.elementsLength);
        index++
      ) {
        let translation = null;

        if (createSliderDtos.message && createSliderDtos.message[index]) {
          const parsedTranslation = JSON.parse(createSliderDtos.message[index]);
          translation = {
            message: parsedTranslation,
          };
        }

        let newSlider = new this.sliderModel({
          name: createSliderDtos.name[index],
          link: createSliderDtos.link[index],
          translation: translation,
        });

        if (files && files.length > 0) {
          const image = files[index].path.replace(/\\/g, '/');
          newSlider.image = image;
        }

        documentsToUpload.push(newSlider);
      }

      this.sliderModel.insertMany(documentsToUpload, { ordered: true });

      const responseObj = {
        status: HttpStatus.CREATED,
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async findAll(): Promise<{ status: number; data: Slider[] }> {
    try {
      const sliders = await this.sliderModel.find().exec();
      if (!sliders) {
        throw new HttpException('No sliders found', HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        data: sliders,
      };
    } catch (error) {
      throw new UnexpectedException(error);
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async update(
    updateSliderDtos: UpdateSliderDto[] | any,
    files: Express.Multer.File[],
    response,
  ): Promise<Slider> {
    try {
      let bulkOperations = [];

      for (
        let index = 0;
        index < Number(updateSliderDtos.elementsLength);
        index++
      ) {
        let translation = null;

        if (updateSliderDtos.message && updateSliderDtos.message[index]) {
          const parsedTranslation = JSON.parse(updateSliderDtos.message[index]);
          translation = {
            message: parsedTranslation,
          };
        }

        let newSlider = new this.sliderModel({
          _id: updateSliderDtos.identifier[index],
          name: updateSliderDtos.name[index],
          link: updateSliderDtos.link[index],
          translation: translation,
        });

        if (files && files.length > 0) {
          const image = files[index].path.replace(/\\/g, '/');
          newSlider.image = image;
        }

        bulkOperations.push({
          updateOne: {
            filter: { _id: updateSliderDtos.identifier[index] },
            update: { $set: newSlider }, // Or use $inc, $push, etc. as needed
          },
        });
      }

      await this.sliderModel.bulkWrite(bulkOperations, { ordered: true });

      const responseObj = {
        status: HttpStatus.CREATED,
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new UnexpectedException(error);
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }
}
