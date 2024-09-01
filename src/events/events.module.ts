import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './schema/event.schema';
import { LastreadingModule } from 'src/lastreading/lastreading.module';
import { UsersreadingModule } from 'src/usersreading/usersreading.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    LastreadingModule,
    UsersreadingModule,
    UserModule,
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
