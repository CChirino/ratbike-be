import { Module } from '@nestjs/common';
import { LastReadingService } from './lastreading.service';
import { LastReadingController } from './lastreading.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LastReading, LastReadingSchema } from './schema/lastreading.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LastReading.name, schema: LastReadingSchema },
    ]),
  ],
  controllers: [LastReadingController],
  providers: [LastReadingService],
  exports: [LastReadingService],
})
export class LastreadingModule {}
