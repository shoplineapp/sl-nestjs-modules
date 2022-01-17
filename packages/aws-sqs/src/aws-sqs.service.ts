import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { fromWebToken } from '@aws-sdk/credential-providers';
import { Inject, Injectable } from '@nestjs/common';
import { AwsSQSOptions } from './aws-sqs.options.interface';
import { AWS_SQS_OPTIONS } from './constants';

@Injectable()
export class AwsSQSService {
  private readonly client: SQSClient;

  constructor(@Inject(AWS_SQS_OPTIONS) opts: AwsSQSOptions) {
    const { region, roleArn, webIdentityToken } = opts;
    this.client = new SQSClient({ region, credentials: fromWebToken({ roleArn, webIdentityToken }) });
  }

  async sendMessage(queueUrl: string, messageBody: string) {
    try {
      const message = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
      });
      await this.client.send(message);
    } catch (error) {
      throw error;
    }
  }
}
