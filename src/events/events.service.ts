import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schema/event.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LastReadingService } from 'src/lastreading/lastreading.service';
import { Types } from 'mongoose';
import { UsersreadingService } from 'src/usersreading/usersreading.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private lastReadingService: LastReadingService, // Inyecta el servicio aquí
    private userReadingService: UsersreadingService,
    private usersService: UserService,
  ) {}

  async findAll(user: any): Promise<Event[]> {
    try {
      const lastReadingId = new Types.ObjectId(
        '66d0e60e052326d271e4dd5c',
      ).toString();
      await this.lastReadingService.updateEvents(lastReadingId, {
        events: new Date(),
      });

      let lastReading = await this.lastReadingService.findOne();

      if (!lastReading) {
        // Crear un nuevo registro si no existe
        lastReading = await this.lastReadingService.create({
          news: null,
          brotherhood: null,
          events: new Date(),
          store: null,
          wall: null,
        });
      } else {
        // Actualizar el campo 'news' si el registro ya existe
        await this.lastReadingService.updateEvents(lastReading._id.toString(), {
          events: new Date(),
        });
      }

      await this.handleUserReading(user);

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

  private async handleUserReading(user: any): Promise<void> {
    try {
      // Buscar el ID del usuario por su correo electrónico
      const userId = await this.usersService.findUserIdByEmail(user.email);

      if (!userId) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      // Buscar el registro de lectura del usuario
      let usersReading = await this.userReadingService.findOneByUserId(userId);

      // Datos a utilizar para la creación o actualización
      const updateData = {
        events: new Date(),
      };

      if (!usersReading) {
        // Crear un nuevo registro si no existe
        usersReading = await this.userReadingService.create({
          userId,
          ...updateData,
          news: null,
          brotherhood: null,
          store: null,
          wall: null,
        });
      } else {
        // Verifica que el registro exista antes de actualizar
        if (!usersReading._id) {
          throw new HttpException(
            'Registro de lectura del usuario no válido.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        // Actualizar el campo 'news' si el registro ya existe
        await this.userReadingService.updateReadingUsers(
          usersReading._id.toString(), // Verifica que `_id` esté presente en el documento.
          updateData,
        );
      }
    } catch (error) {
      // Manejar errores
      console.error(
        'Error al manejar el registro de lectura del usuario:',
        error,
      );
      throw error;
    }
  }
}
