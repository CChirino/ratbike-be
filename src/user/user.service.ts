import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userModel
        .find({
          $or: [{ delete_at: null }, { delete_date: null }],
        })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return this.userModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    user: User,
    file: Express.Multer.File,
  ): Promise<User> {
    if (file && file[0]?.path) {
      const urlProfileImage = file[0].path.replace(/\\/g, '/');
      user.urlProfileImage = urlProfileImage;
    }
    if (user.password && user.password.length) {
      user.password = await hash(user.password, 10);
    }

    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();

      if (user) {
        user.delete_at = new Date().toISOString();
        user.delete_date = new Date();
        await user.save();
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserIdByEmail(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      return user._id.toString(); // Convertir el ObjectId a string
    }
    throw new Error('Usuario no encontrado');
  }
}
