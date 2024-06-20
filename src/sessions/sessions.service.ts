import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session, SessionDocument } from './schema/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
      return await this.sessionModel.create(createSessionDto);
  }

  async findAll() {
    try {
      const data = await this.sessionModel.find().exec();
      
      const responseObj: {
        status: number;
        data: Session[];
        } = {
          status: HttpStatus.OK,
          data,
          };
        console.log({data});

      return await data;
    } catch (error) {
      console.log({error})
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const data = this.sessionModel.findById(id).exec();

      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    try {
      const updatedSession = await this.sessionModel
        .findByIdAndUpdate(id, updateSessionDto, { new: true })
        .exec();

      if (!updatedSession) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return updatedSession;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string ) {
    try {
      await this.sessionModel.findOneAndDelete({id}).exec();

      return {
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}

