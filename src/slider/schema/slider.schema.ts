import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SliderDocument = Slider & Document;

@Schema()
export class Slider {
  @Prop()
  name: string;

  @Prop()
  link: string;

  @Prop({ type: [String], default: [] })
  image: string[];
  
  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    message: Record<string, any>;
  };

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const SliderSchema = SchemaFactory.createForClass(Slider);
