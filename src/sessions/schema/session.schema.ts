import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { uuid } from 'uuidv4';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop()
  userId: string;
  @Prop({ default: uuid() })
  sessionId: string;
  @Prop()
  latitude: string;
  @Prop()
  longitude: string;
  @Prop()
  country: string;
  @Prop()
  name: string;
  @Prop()
  lastname: string;
  @Prop({ default: null })
  vocation: string;
  @Prop({ default: null })
  city: string;
  @Prop()
  email: string;
  @Prop()
  urlProfileImage: string;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
