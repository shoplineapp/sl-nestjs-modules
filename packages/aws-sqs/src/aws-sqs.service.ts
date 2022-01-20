import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Inject, Injectable } from '@nestjs/common';
import { AwsSQSOptions } from './aws-sqs.options.interface';
import { AWS_SQS_OPTIONS } from './constants';

/** Service class providing interface to AWS SQS */
@Injectable()
export class AwsSQSService {
  private readonly client: SQSClient;

  constructor(@Inject(AWS_SQS_OPTIONS) opts: AwsSQSOptions) {
    this.client = new SQSClient(opts);
  }

  /**
   * Sending message to AWS SQS
   * @param queueUrl The URL of the Amazon SQS queue to which a message is sent
   * @param messageBody The message to send. The minimum size is one character. The maximum size is 256 KB
   */
  async sendMessage(queueUrl: string, messageBody: string): Promise<void> {
    const message = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    });
    await this.client.send(message);
  }
}
