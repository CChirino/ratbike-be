import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  lastname: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ['user', 'admin', 'moderador'], default: 'user' })
  role: string;

  @Prop({ default: false })
  delete_at: string;

  @Prop({ type: Date }) // Agrega el tipo Date aquí
  delete_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
