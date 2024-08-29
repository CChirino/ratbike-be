import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LastReadingDocument = LastReading & Document;

@Schema({ toJSON: { virtuals: true } })
export class LastReading {
  @Prop({ type: Date, required: false, default: null })
  news: Date;

  @Prop({ type: Date, required: false, default: null })
  brotherhood: Date;

  @Prop({ type: Date, required: false, default: null })
  events: Date;

  @Prop({ type: Date, required: false, default: null })
  store: Date;

  @Prop({ type: Date, required: false, default: null })
  wall: Date;
}

export const LastReadingSchema = SchemaFactory.createForClass(LastReading);
