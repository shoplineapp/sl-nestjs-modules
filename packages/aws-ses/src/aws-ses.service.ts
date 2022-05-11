import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Inject, Injectable } from '@nestjs/common';
import { AwsSESOptions } from './aws-ses.options.interface';
import { AWS_SES_OPTIONS } from './constants';

/** Service class providing interface to AWS SES */
@Injectable()
export class AwsSESService {
  private readonly client: SESClient;

  constructor(@Inject(AWS_SES_OPTIONS) opts: AwsSESOptions) {
    this.client = new SESClient(opts);
  }

  /**
   * Sending email through AWS SES
   * @param sender The email address that is sending the email
   * @param toAddresses The destination email addresses for the email
   * @param subject The subject of the email
   * @param body The HTML body of the email
   */
  async sendEmail(sender: string, toAddresses: string[], subject: string, body: string): Promise<void> {
    const command = new SendEmailCommand({
      Destination: { ToAddresses: toAddresses },
      Message: {
        Body: { Html: { Charset: 'UTF-8', Data: body } },
        Subject: { Charset: 'UTF-8', Data: subject },
      },
      Source: sender,
      ReplyToAddresses: [sender],
    });
    await this.client.send(command);
  }
}
