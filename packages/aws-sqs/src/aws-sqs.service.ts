import { SQSClient } from '@aws-sdk/client-sqs';
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

  async sendMessage(req: AwsSqsSendMessageRequestDto) {
    try {
      const dto = plainToClass(AwsSqsSendMessageRequestDto, req);

      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new AwsSqsSendMessageInvalidInputError(errors.toString());
      }

      const message = new SendMessageCommand({
        QueueUrl: dto.queueUrl,
        MessageBody: dto.body,
      });

      await this.client.send(message);
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(`caught an error when AwsSqsService#sendMessage: ${errorMessage}`);
      if (error instanceof AwsSqsSendMessageInvalidInputError) {
        throw error;
      }
      throw new AwsSqsSendMessageError(errorMessage);
    }
  }
}
