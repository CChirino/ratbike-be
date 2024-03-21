import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryArticleDocument = CategoryArticle & Document;

@Schema()
export class CategoryArticle {
  @Prop()
  nameCategoryArticle: string;

  @Prop()
  descriptionCategoryArticle: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const CategoryProductSchema =
  SchemaFactory.createForClass(CategoryArticle);
