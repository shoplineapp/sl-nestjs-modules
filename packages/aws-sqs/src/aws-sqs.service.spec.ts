import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Credentials } from '@aws-sdk/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsSQSOptions } from './aws-sqs.options.interface';
import { AwsSQSService } from './aws-sqs.service';
import { AWS_SQS_OPTIONS } from './constants';

jest.mock('@aws-sdk/client-sqs');

describe('AwsSQSService', () => {
  let mockRegion: string;
  let mockCredentials: Credentials;
  let mockOpts: AwsSQSOptions;
  let service: AwsSQSService;

  beforeEach(async () => {
    mockRegion = 'mock-region';
    mockCredentials = {} as never;
    mockOpts = { region: mockRegion, credentials: mockCredentials };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AWS_SQS_OPTIONS, useValue: mockOpts }, AwsSQSService],
    }).compile();

    service = module.get(AwsSQSService);
  });

  it('create SQSClient', () => {
    expect(SQSClient).toBeCalledTimes(1);
    expect(SQSClient).toBeCalledWith(mockOpts);
  });

  describe('#sendMessage', () => {
    const mockQueueUrl = 'mock-queue-url';
    const mockMessageBody = 'mock-message';
    const mockMessage = {
      QueueUrl: mockQueueUrl,
      MessageBody: mockMessageBody,
    };

    it('should send message', async () => {
      const clientSendSpy = jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({} as never);
      await expect(service.sendMessage(mockQueueUrl, mockMessageBody)).resolves.toBe(undefined);
      expect(SendMessageCommand).toBeCalledWith(mockMessage);
      expect(clientSendSpy).toBeCalledWith(expect.any(SendMessageCommand));
    });
  });
});
