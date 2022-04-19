import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../features/roles/role.module';
import { UserModule } from '../features/users/user.module';
import { MedicinesModule } from '../features/medicines/medicines.module';
import { MedicineSalesModule } from '../features/medicine-sales/medicine-sales.module';

@Module({
  imports: [
    RoleModule,
    UserModule,
    MedicinesModule,
    MedicineSalesModule,
    MongooseModule.forRoot('mongodb://localhost:27017'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
