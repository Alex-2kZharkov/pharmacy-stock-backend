import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('example.com+5-key.pem'),
    cert: fs.readFileSync('example.com+5.pem'),
  };

  const port = 8000;
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.enableCors();
  await app.listen(port);
  console.log(`APP STARTED IN PORT ${port}`);
}
bootstrap();
