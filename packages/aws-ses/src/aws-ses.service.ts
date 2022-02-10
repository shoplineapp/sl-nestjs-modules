import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Inject, Injectable } from '@nestjs/common';
import { AwsSESOptions } from './aws-ses.options.interface';
import { AWS_SES_OPTIONS } from './constants';

/** Service class providing interface to AWS SQS */
@Injectable()
export class AwsSESService {
  private readonly client: SESClient;

  constructor(@Inject(AWS_SES_OPTIONS) opts: AwsSESOptions) {
    this.client = new SESClient(opts);
  }

  /**
   * Sending message to AWS SQS
   * @param queueUrl The URL of the Amazon SQS queue to which a message is sent
   * @param messageBody The message to send. The minimum size is one character. The maximum size is 256 KB
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
