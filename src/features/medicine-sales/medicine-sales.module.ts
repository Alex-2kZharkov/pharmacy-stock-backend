import { Module } from '@nestjs/common';
import { MedicineSalesService } from './medicine-sales.service';
import { MedicineSalesController } from './medicine-sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineSale, MedicineSaleSchema } from './entities/medicine.schema';
import {
  Medicine,
  MedicineSchema,
} from '../medicines/entities/medicine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
    ]),
    MongooseModule.forFeature([
      { name: MedicineSale.name, schema: MedicineSaleSchema },
    ]),
  ],
  controllers: [MedicineSalesController],
  providers: [MedicineSalesService],
})
export class MedicineSalesModule {}
