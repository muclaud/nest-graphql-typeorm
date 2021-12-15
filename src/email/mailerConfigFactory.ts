import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export function mailerConfigFactory(
  config: ConfigService,
): MailerOptions | Promise<MailerOptions> {
  return {
    transport: {
      host: config.get('EMAIL_SERVER_HOST'),
      port: config.get('EMAIL_SERVER_PORT'),
      secure: false,
      auth: {
        user: config.get('EMAIL_SERVER_USER'),
        pass: config.get('EMAIL_SERVER_PASSWORD'),
      },
    },
    defaults: {
      from: `"No Reply" <${config.get('EMAIL_FROM')}>`,
    },
  };
}
