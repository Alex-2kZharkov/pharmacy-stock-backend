import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../features/roles/role.module';

@Module({
  imports: [RoleModule, MongooseModule.forRoot('mongodb://localhost:27017')],
  controllers: [],
  providers: [],
})
export class AppModule {}
