import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Inject, Injectable } from '@nestjs/common';
import { AwsSQSOptions } from './aws-sqs.options.interface';
import { AWS_SQS_OPTIONS } from './constants';

@Injectable()
export class AwsSQSService {
  private readonly client: SQSClient;

  constructor(@Inject(AWS_SQS_OPTIONS) opts: AwsSQSOptions) {
    this.client = new SQSClient(opts);
  }

  async sendMessage(queueUrl: string, messageBody: string): Promise<void> {
    const message = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    });
    await this.client.send(message);
  }
}
