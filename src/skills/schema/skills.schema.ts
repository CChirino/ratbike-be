import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type SkillDocument = Skill & Document;

@Schema()
export class Skill {
  @Prop()
  titleSkill: string;

  @Prop()
  descriptionSkill: string;

  @Prop({ type: Date, required: false, default: null })
  startDateSkill: Date;

  @Prop({ type: Date, required: false, default: null })
  endDateSkill: Date;

  @Prop({ default: undefined })
  urlImageSkill: string;

  @Prop({ type: [String], default: [] })
  galleryImagesSkill: string[];

  @Prop({ type: Date, required: false, default: null })
  update_at: Date;

  @Prop()
  locationSkill: string;

  @Prop()
  citySkill: string;

  @Prop()
  createdBy: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationTitleSkill: Record<string, any>;
    translationDescriptionSkill: Record<string, any>;
  };

  @Prop({
    default: 'revision',
    enum: ['revision', 'aprobado', 'rechazado', 'desactualizado'],
  })
  status: string;

  @Prop()
  startHour: string;

  @Prop()
  endHour: string;

  @Prop()
  rejectedReason: string;

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
