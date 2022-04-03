import { Base } from '../../database/Base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MedicineDocument = Medicine | Document;

@Schema()
export class Medicine extends Base {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  quantity: number;

  @Prop({ isRequired: true })
  amount: number;

  @Prop({ isRequired: true })
  singleAmount: number;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
