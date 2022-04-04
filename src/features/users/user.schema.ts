import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User | Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ isRequired: true })
  firstName: string;

  @Prop({ isRequired: true })
  lastName: string;

  @Prop({ isRequired: true })
  email: string;

  @Prop({ isRequired: true })
  phone: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
