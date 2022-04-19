import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '../../../database/Base.schema';

export type MedicineDocument = Medicine | Document;

@Schema()
export class Medicine {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  quantity: number;

  @Prop({ isRequired: true })
  primaryAmount: number;

  @Prop({ isRequired: true })
  finalAmount: number;

  @Prop({ isRequired: true })
  percent: number;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
