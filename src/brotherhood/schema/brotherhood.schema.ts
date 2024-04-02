import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type BrotherhoodDocument = Brotherhood & Document;

@Schema({ toJSON: { virtuals: true } })
export class Brotherhood {
  @Prop()
  nameBrotherhood: string;

  @Prop()
  descriptionBrotherhood: string;

  @Prop()
  category: string;

  @Prop()
  link: string;

  @Prop({ default: undefined })
  urlImageBrotherhood: string;

  @Prop({ type: [String], default: [] })
  galleryImagesBrotherhood: string[];

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop()
  createdBy: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  translation: {
    translationName: Record<string, any>;
    translationDescription: Record<string, any>;
  };

  @Prop({ default: 'revision', enum: ['revision', 'aprobado', 'rechazado'] })
  status: string;

  @Prop()
  rejectedReason: string;
}

export const BrotherhoodSchema = SchemaFactory.createForClass(Brotherhood);
