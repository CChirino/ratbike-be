import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CategoryArticleDocument = CategoryArticle & Document;

@Schema()
export class CategoryArticle {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationNameCategoryArticle: Record<string, any>;
  };

  @Prop({ default: undefined })
  urlImageCategoryArticles: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const CategoryArticleSchema =
  SchemaFactory.createForClass(CategoryArticle);
