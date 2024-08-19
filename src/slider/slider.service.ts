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
    createSliderDtos: CreateSliderDto[] | any,
    files: Express.Multer.File[],
    response,
    user: any,
  ): Promise<Slider> {
    try {
      let documentsToUpload = [];
      for (let index = 0; index < Number(createSliderDtos.elementsLength); index++) {
        let translation = null;

        if (createSliderDtos.message && createSliderDtos.message[index]) {
          const parsedTranslation = JSON.parse(createSliderDtos.message[index]);
          translation = {
            message:
              parsedTranslation,
          };
        }

        let newSlider = new this.sliderModel({
          name: createSliderDtos.name[index],
          link: createSliderDtos.link[index],
          translation: translation
        });

        if (files && files.length > 0) {
          const image = files[index].path.replace(/\\/g, '/');
          newSlider.image = image;
        }

        documentsToUpload.push(newSlider);

      }

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
    updateSliderDtos: UpdateSliderDto[] | any,
    files: Express.Multer.File[],
    response,
  ): Promise<Slider> {
    try {
      let bulkOperations = [];

      for (let index = 0; index < Number(updateSliderDtos.elementsLength); index++) {
        let translation = null;

        if (updateSliderDtos.message[index]) {
          const parsedTranslation = JSON.parse(updateSliderDtos.message[index]);
          translation = {
            message:
              parsedTranslation,
          };
        }

        let newSlider = new this.sliderModel({
          _id: updateSliderDtos.identifier[index],
          name: updateSliderDtos.name[index],
          link: updateSliderDtos.link[index],
          translation: translation
        });

        if (files && files.length > 0) {
          const image = files[index].path.replace(/\\/g, '/');
          newSlider.image = image;
        }

        bulkOperations.push({
          updateOne: {
            filter: { _id: updateSliderDtos.identifier[index] },
            update: { $set: newSlider }, // Or use $inc, $push, etc. as needed
          }
        }
        );

      }

      await this.sliderModel.bulkWrite(bulkOperations, {ordered: true});

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
      console.log(error);
      throw new HttpException(
        error.message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
