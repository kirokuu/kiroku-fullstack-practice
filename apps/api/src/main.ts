import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParserModule from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParserModule());
  await app.listen(8080);
}
bootstrap();
