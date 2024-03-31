import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CategoryProductDocument = CategoryProduct & Document;

@Schema()
export class CategoryProduct {

  @Prop({ default: undefined })
  urlImageCategory: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationNameCategoryProduct: Record<string, any>;
  };
}

export const CategoryProductSchema =
  SchemaFactory.createForClass(CategoryProduct);
