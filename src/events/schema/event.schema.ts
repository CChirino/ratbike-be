import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  hostName: string;

  @Prop({ type: Object })
  translation: {
    translationEventType: Record<string, any>;
    translationEventDescription: Record<string, any>;
  };

  @Prop({ type: Array, required: true })
  presentations: {
    eventDate: string;
    Country: string;
    openHour: string;
    link: string;
    cityLocation: string;
  }[];

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop({ type: Date, required: false, default: null })
  update_at: Date;

  @Prop()
  createdBy: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
