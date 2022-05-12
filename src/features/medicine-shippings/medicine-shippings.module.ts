import { Module } from '@nestjs/common';
import { MedicineShippingsService } from './medicine-shippings.service';
import { MedicineShippingsController } from './medicine-shippings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Medicine,
  MedicineSchema,
} from '../medicines/entities/medicine.schema';
import {
  MedicineShipping,
  MedicineShippingSchema,
} from './entities/medicine-shipping.schema';
import { Budget, BudgetSchema } from '../../database/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
    ]),
    MongooseModule.forFeature([
      { name: MedicineShipping.name, schema: MedicineShippingSchema },
    ]),
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
  ],
  controllers: [MedicineShippingsController],
  providers: [MedicineShippingsService],
})
export class MedicineShippingsModule {}
