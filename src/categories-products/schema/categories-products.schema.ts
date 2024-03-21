import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryProductDocument = CategoryProduct & Document;

@Schema()
export class CategoryProduct {
  @Prop()
  nameCategoryProduct: string;

  @Prop()
  descriptionCategoryProduct: string;

  @Prop({ default: undefined })
  urlImageCategory: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const CategoryProductSchema =
  SchemaFactory.createForClass(CategoryProduct);
