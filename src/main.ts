import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('ServerBootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({ origin: '*', credentials: true });
  app.use(cookieParser());

  const PORT = process.env.PORT || 3001;
  await app.listen(3000);
  logger.log(`The Web Server is running on localhost:${PORT}`);
}
bootstrap();
