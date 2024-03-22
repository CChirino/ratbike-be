import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ toJSON: { virtuals: true } })
export class Product {
  @Prop()
  nameProduct: string;

  @Prop()
  descriptionProduct: string;

  @Prop()
  category: string;

  @Prop()
  link: string;

  @Prop({ default: undefined })
  urlImageProduct: string;

  @Prop({ type: [String], default: [] })
  galleryImages: string[];

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop()
  createdBy: string;

  @Prop({ type: mongoose.Schema.Types.Mixed }) // Utilizar el tipo Mixed para almacenar un objeto JSON
  language: {
    languageNameProduct: Record<string, any>;
    languageDescriptionProduct: Record<string, any>;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product);
