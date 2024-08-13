import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SliderDocument = Slider & Document;

@Schema()
export class Slider {
  @Prop()
  name: string;

  @Prop()
  link: string;

  @Prop({ default: undefined })
  image1: string;

  @Prop({ default: undefined })
  image2: string;

  @Prop({ default: undefined })
  image3: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const SliderSchema = SchemaFactory.createForClass(Slider);
