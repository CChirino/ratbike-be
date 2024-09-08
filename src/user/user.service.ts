import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { hash } from 'bcrypt';
import { UnexpectedException } from 'src/Unexpected.exception';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      return createdUser.save();
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const user = await this.userModel
        .find({
          $or: [{ delete_at: null }, { delete_date: null }],
        })
        .exec();

      if (!user) {
        throw new HttpException('UNABLE_TO_GET_USERS', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new HttpException('UNABLE_TO_GET_USER', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async update(
    id: string,
    user: User,
    file: Express.Multer.File,
  ): Promise<User> {
    try {
      if (file && file[0]?.path) {
        const urlProfileImage = file[0].path.replace(/\\/g, '/');
        user.urlProfileImage = urlProfileImage;
      }
      if (user.password && user.password.length) {
        user.password = await hash(user.password, 10);
      }

      return this.userModel.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();

      if (user) {
        user.delete_at = new Date().toISOString();
        user.delete_date = new Date();
        await user.save();
      } else {
        throw new HttpException('UNPROCESSABLE_ENTITY', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }

  async findUserIdByEmail(email: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (user) {
        return user._id.toString(); // Convertir el ObjectId a string
      } else {
        throw new HttpException('UNABLE_TO_GET_USER', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnexpectedException(error);
      }
    }
  }
}
