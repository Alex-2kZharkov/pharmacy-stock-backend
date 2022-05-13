import { Module } from '@nestjs/common';
import { MedicineSalesService } from './medicine-sales.service';
import { MedicineSalesController } from './medicine-sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicineSale,
  MedicineSaleSchema,
} from './entities/medicine-sales.schema';
import {
  Medicine,
  MedicineSchema,
} from '../medicines/entities/medicine.schema';
import { Budget, BudgetSchema } from '../../database/budget.schema';
import {
  MedicineShipping,
  MedicineShippingSchema,
} from '../medicine-shippings/entities/medicine-shipping.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
    ]),
    MongooseModule.forFeature([
      { name: MedicineSale.name, schema: MedicineSaleSchema },
    ]),
    MongooseModule.forFeature([
      { name: MedicineShipping.name, schema: MedicineShippingSchema },
    ]),
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
  ],
  controllers: [MedicineSalesController],
  providers: [MedicineSalesService],
})
export class MedicineSalesModule {}
