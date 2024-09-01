import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UsersReadingDocument = UsersReading & Document;

@Schema({ toJSON: { virtuals: true } })
export class UsersReading {
  _id: string;
  @Prop()
  userId: string;

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

export const UsersReadingSchema = SchemaFactory.createForClass(UsersReading);
