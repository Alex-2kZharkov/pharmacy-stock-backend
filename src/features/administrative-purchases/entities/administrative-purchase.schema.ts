import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdministrativePurchaseDocument = AdministrativePurchase | Document;

@Schema({ timestamps: true })
export class AdministrativePurchase {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  amount: number;
}

export const AdministrativePurchaseSchema = SchemaFactory.createForClass(
  AdministrativePurchase,
);
