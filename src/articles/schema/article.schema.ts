import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ toJSON: { virtuals: true } })
export class Article {
  @Prop()
  title: string;

  @Prop()
  subtitle: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  link: string;

  @Prop({ default: undefined })
  urlImageArticle: string;

  @Prop({ type: [String], default: [] })
  galleryImagesArticles: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationTitle: Record<string, any>;
    translationSubtitle: Record<string, any>;
    translationDescription: Record<string, any>;
  };

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
