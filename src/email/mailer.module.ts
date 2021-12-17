import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_SERVER_HOST'),
          port: configService.get('EMAIL_SERVER_PORT'),
          secure: false,
          auth: {
            user: configService.get('EMAIL_SERVER_USER'),
            pass: configService.get('EMAIL_SERVER_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('EMAIL_FROM')}>`,
        },
      }),
    }),
  ],
})
export class MailModule {}
