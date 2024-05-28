import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type WallDocument = Wall & Document;

@Schema({ toJSON: { virtuals: true } })
export class Wall {
  @Prop()
  titleWall: string;

  @Prop()
  descriptionWall: string;

  @Prop()
  skillWall: string;

  @Prop({ type: Date, required: false, default: null })
  startDateWall: Date;

  @Prop({ type: Date, required: false, default: null })
  endDateWall: Date;

  @Prop({ default: undefined })
  urlImageWall: string;

  @Prop()
  type: 'product' | 'skill';

  @Prop({ type: [String], default: [] })
  galleryImagesWall: string[];

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop({ type: Date, required: false, default: null })
  update_at: Date;

  @Prop()
  locationWall: string;

  @Prop()
  cityWall: string;

  @Prop()
  createdBy: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationTitleWall: Record<string, any>;
    translationDescriptionWall: Record<string, any>;
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

  @Prop({ default: false })
  isPaid: boolean;
}

export const WallSchema = SchemaFactory.createForClass(Wall);
