import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Medicine, MedicineSchema } from './entities/medicine.schema';
import {
  MedicineSale,
  MedicineSaleSchema,
} from '../medicine-sales/entities/medicine-sales.schema';
import {
  Recommendation,
  RecommendationSchema,
} from '../recommendations/entities/recommendation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
      { name: MedicineSale.name, schema: MedicineSaleSchema },
      { name: Recommendation.name, schema: RecommendationSchema },
    ]),
  ],
  controllers: [MedicinesController],
  providers: [MedicinesService],
})
export class MedicinesModule {}
