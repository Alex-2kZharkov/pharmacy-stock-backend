import { Module } from '@nestjs/common';
import { AdministrativePurchasesService } from './administrative-purchases.service';
import { AdministrativePurchasesController } from './administrative-purchases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdministrativePurchase,
  AdministrativePurchaseSchema,
} from './entities/administrative-purchase.schema';
import { Budget, BudgetSchema } from '../../database/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AdministrativePurchase.name,
        schema: AdministrativePurchaseSchema,
      },
      {
        name: Budget.name,
        schema: BudgetSchema,
      },
    ]),
  ],
  controllers: [AdministrativePurchasesController],
  providers: [AdministrativePurchasesService],
})
export class AdministrativePurchasesModule {}
