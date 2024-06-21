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
  nombre: string;
  @Prop()
  apellido: string;
  @Prop()
  vocacion: string;
  @Prop()
  ciudad: string;
  @Prop()
  email: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const sessionSchema = SchemaFactory.createForClass(Session);
