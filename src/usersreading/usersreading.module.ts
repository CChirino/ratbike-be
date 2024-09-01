import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersreadingService } from './usersreading.service';
import { UsersreadingController } from './usersreading.controller';
import { UsersReading, UsersReadingSchema } from './schema/usersreading.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersReading.name, schema: UsersReadingSchema },
    ]),
  ],
  controllers: [UsersreadingController],
  providers: [UsersreadingService],
  exports: [UsersreadingService],
})
export class UsersreadingModule {}
