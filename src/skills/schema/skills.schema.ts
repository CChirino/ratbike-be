import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type SkillDocument = Skill & Document;

@Schema()
export class Skill {
  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationNameSkill: Record<string, any>;
  };
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
