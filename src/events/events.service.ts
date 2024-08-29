import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schema/event.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LastReadingService } from 'src/lastreading/lastreading.service';
import { Types } from 'mongoose';
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private lastReadingService: LastReadingService, // Inyecta el servicio aquí
  ) {}

  async findAll(): Promise<Event[]> {
    try {
      const lastReadingId = new Types.ObjectId(
        '66d0e60e052326d271e4dd5c',
      ).toString();
      await this.lastReadingService.updateEvents(lastReadingId, {
        events: new Date(),
      });
      return await this.eventModel
        .find({ delete_at: null, delete_date: null })
        .exec();
    } catch (error) {
      console.error('Error during findAll:', error.message);
      throw new HttpException(
        'Error fetching events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Event> {
    try {
      const event = await this.eventModel.findById(id).exec();
      if (!event) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      }
      return event;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Error fetching event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createEventDto: CreateEventDto,
    user: any,
    response,
  ): Promise<Event> {
    try {
      let translation = null;

      if (createEventDto.translation) {
        const parsedTranslation = JSON.parse(createEventDto.translation);

        translation = {
          translationEventType: parsedTranslation.translationEventType,
          translationEventDescription:
            parsedTranslation.translationEventDescription,
        };
      }

      const createdEvent = new this.eventModel({
        ...createEventDto,
        ...(translation && { translation }),
        delete_at: null,
        delete_date: null,
        update_at: null,
        createdBy: user.name + ' ' + user.lastname,
      });
      await createdEvent.save(); // Asegúrate de guardar el documento en la base de datos
      const responseObj = {
        status: HttpStatus.OK,
        data: createdEvent,
      };
      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      throw new HttpException(
        'Error creating event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    try {
      let translation = null;

      if (updateEventDto.translation) {
        const parsedTranslation = JSON.parse(updateEventDto.translation);

        translation = {
          translationEventType: parsedTranslation.translationEventType,
          translationEventDescription:
            parsedTranslation.translationEventDescription,
        };
      }

      const updatedEvent = await this.eventModel
        .findByIdAndUpdate(
          id,
          {
            ...updateEventDto,
            ...(translation && { translation }),
          },
          { new: true },
        )
        .exec();
      if (!updatedEvent) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      }
      return updatedEvent;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Error updating event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Event> {
    try {
      const deletedEvent = await this.eventModel.findById(id).exec();
      if (deletedEvent) {
        deletedEvent.delete_at = new Date().toISOString();
        deletedEvent.delete_date = new Date();
        await deletedEvent.save();
      }
      if (!deletedEvent) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      }
      return deletedEvent;
    } catch (error) {
      console.log(error);
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Error deleting event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
