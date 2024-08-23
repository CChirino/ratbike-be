import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session, SessionDocument } from './schema/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionsService {
  private invalidatedTokens: Set<string> = new Set();
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
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

      return await data;
    } catch (error) {
      console.log({ error });
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(userId: string): Promise<SessionDocument | null> {
    try {
      // Busca una sesión donde userId coincida
      const session = await this.sessionModel.findOne({ userId }).exec();
      return session;
    } catch (error) {
      console.error('Error finding session:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<SessionDocument> {
    try {
      const updatedSession = await this.sessionModel
        .findByIdAndUpdate(id, updateSessionDto, { new: true })
        .exec();

      if (!updatedSession) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      return updatedSession;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, user: any) {
    try {
      const result = await this.sessionModel
        .findOneAndDelete({ email: user.email  })
        .exec();

      if (result) {
        console.log(`Successfully removed session from user: ${id}`);
      } else {
        console.log(`No session found with ID: ${id}`);
      }

      return {
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error removing session:', error);
      throw error;
    }
  }

  async invalidateToken(token: string, user: any): Promise<void> {
    try {
      const session = await this.sessionModel
        .findOne({ email: user.email })
        .exec();
      if (!session) {
        throw new Error('Session not found for the provided email');
      }
      await this.remove(session._id.toString(), user);
      this.invalidatedTokens.add(token);
    } catch (error) {
      console.error('Error invalidando el token:', error);
      throw error;
    }
  }

  async isTokenInvalidated(token: string): Promise<boolean> {
    return this.invalidatedTokens.has(token);
  }
}
