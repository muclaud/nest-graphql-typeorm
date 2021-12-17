import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
// import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { graphqlUploadExpress } from 'graphql-upload';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { Upload } from './common/scalars/upload.scalar';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { mailerConfigFactory } from './email/mailerConfigFactory';
import { FileUploadModule } from './file-upload/file-upload.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        EMAIL_SERVER_HOST: Joi.string().required(),
        EMAIL_SERVER_PORT: Joi.string().required(),
        EMAIL_SERVER_USER: Joi.string().required(),
        EMAIL_SERVER_PASSWORD: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: true,
      },
      playground: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerConfigFactory,
      inject: [ConfigService],
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    PostsModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [Upload],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
