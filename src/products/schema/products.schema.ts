import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Decimal128 } from 'mongodb';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  nameProduct: string;

  @Prop()
  descriptionProduct: string;

  @Prop()
  sku: string;

  @Prop()
  category: string;

  @Prop({ type: Decimal128 })
  price: Decimal128;

  @Prop()
  currency: string;

  @Prop({ default: undefined })
  urlImageProduct: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
