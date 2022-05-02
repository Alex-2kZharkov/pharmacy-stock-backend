import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Medicine } from '../../medicines/entities/medicine.schema';

export type MedicineSaleDocument = MedicineSale | Document;

@Schema({ timestamps: true })
export class MedicineSale {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    isRequired: true,
  })
  medicine: Medicine;

  @Prop({ isRequired: true })
  quantity: number;

  @Prop({ isRequired: true })
  amountPerUnit: number;

  @Prop({ isRequired: true })
  totalAmount: number;
}

export const MedicineSaleSchema = SchemaFactory.createForClass(MedicineSale);
