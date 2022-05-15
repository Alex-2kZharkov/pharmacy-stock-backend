import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Medicine } from '../../medicines/entities/medicine.schema';

export type RecommendationDocument = Recommendation | Document;

@Schema({ timestamps: true })
export class Recommendation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    isRequired: true,
  })
  medicine: Medicine;

  @Prop({ isRequired: true })
  description: string;
}

export const RecommendationSchema =
  SchemaFactory.createForClass(Recommendation);
