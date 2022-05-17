import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = Category | Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ isRequired: true })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
