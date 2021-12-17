import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';
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
  app.use(graphqlUploadExpress({ maxFileSize: 2 * 1000 * 1000 }));

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  logger.log(`🚀 ~ The Web Server is running on localhost:${PORT}`);
}
bootstrap();
