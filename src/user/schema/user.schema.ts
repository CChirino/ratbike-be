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

  @Prop({ default: null, required: false })
  delete_at: string;

  @Prop({ type: Date, required: false, default: null })
  delete_date: Date;

  @Prop()
  country: string;

  @Prop({ default: undefined })
  urlProfileImage: string; // Cambiado a string
}

export const UserSchema = SchemaFactory.createForClass(User);
