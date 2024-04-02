import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CategoryBrotherhoodDocument = CategoryBrotherhood & Document;

@Schema()
export class CategoryBrotherhood {
  @Prop({ default: undefined })
  urlImageCategoryBrotherhood: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationNameCategoryBrotherhood: Record<string, any>;
  };
}

export const CategoryBrotherhoodSchema =
  SchemaFactory.createForClass(CategoryBrotherhood);
