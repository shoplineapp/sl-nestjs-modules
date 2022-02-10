import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Credentials } from '@aws-sdk/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsSESOptions } from './aws-ses.options.interface';
import { AwsSESService } from './aws-ses.service';
import { AWS_SES_OPTIONS } from './constants';

jest.mock('@aws-sdk/client-sqs');

describe('AwsSQSService', () => {
  let mockRegion: string;
  let mockCredentials: Credentials;
  let mockOpts: AwsSESOptions;
  let service: AwsSESService;

  beforeEach(async () => {
    mockRegion = 'mock-region';
    mockCredentials = {} as never;
    mockOpts = { region: mockRegion, credentials: mockCredentials };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AWS_SES_OPTIONS, useValue: mockOpts }, AwsSESService],
    }).compile();

    service = module.get(AwsSESService);
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
