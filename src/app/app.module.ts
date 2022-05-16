import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../features/roles/role.module';
import { UserModule } from '../features/users/user.module';
import { MedicinesModule } from '../features/medicines/medicines.module';
import { MedicineSalesModule } from '../features/medicine-sales/medicine-sales.module';
import { MedicineShippingsModule } from '../features/medicine-shippings/medicine-shippings.module';
import { BudgetModule } from '../features/budget/budget.module';
import { RecommendationsModule } from '../features/recommendations/recommendations.module';
import { AdministrativePurchasesModule } from '../features/administrative-purchases/administrative-purchases.module';
import { AuthModule } from '../features/auth-module/auth.module';

@Module({
  imports: [
    AuthModule,
    AdministrativePurchasesModule,
    BudgetModule,
    RoleModule,
    UserModule,
    MedicinesModule,
    MedicineSalesModule,
    MedicineShippingsModule,
    RecommendationsModule,
    MongooseModule.forRoot('mongodb://localhost:27017'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
