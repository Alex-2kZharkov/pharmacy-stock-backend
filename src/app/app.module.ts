import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../features/roles/role.module';
import { UserModule } from '../features/users/user.module';

@Module({
  imports: [
    RoleModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
