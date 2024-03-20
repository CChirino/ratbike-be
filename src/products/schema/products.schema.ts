import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
