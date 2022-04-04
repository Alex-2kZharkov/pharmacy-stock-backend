import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const port = 8000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`APP STARTED IN PORT ${port}`);
}
bootstrap();
