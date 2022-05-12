import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Medicine } from '../../medicines/entities/medicine.schema';

export type MedicineShippingDocument = MedicineShipping | Document;

@Schema({ timestamps: true })
export class MedicineShipping {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    isRequired: true,
  })
  medicine: Medicine;

  @Prop({ isRequired: true })
  quantity: number;

  @Prop({ isRequired: true })
  expirationDate: Date;

  @Prop({ isRequired: true })
  totalAmount: number;
}

export const MedicineShippingSchema =
  SchemaFactory.createForClass(MedicineShipping);
