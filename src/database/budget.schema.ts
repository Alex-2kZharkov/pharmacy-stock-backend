import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BudgetDocument = Budget | Document;

@Schema({ timestamps: true })
export class Budget {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  amount: number;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
