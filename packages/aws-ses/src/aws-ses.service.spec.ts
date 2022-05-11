import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Credentials } from '@aws-sdk/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsSESOptions } from './aws-ses.options.interface';
import { AwsSESService } from './aws-ses.service';
import { AWS_SES_OPTIONS } from './constants';

jest.mock('@aws-sdk/client-ses');

describe('AwsSESService', () => {
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

  it('create SESClient', () => {
    expect(SESClient).toBeCalledTimes(1);
    expect(SESClient).toBeCalledWith(mockOpts);
  });

  describe('#sendEmail', () => {
    const mockSender = 'mock-sender';
    const mockAddresses = ['mock-address'];
    const mockSubject = 'mock-subject';
    const mockBody = 'mock-body'
    const expectCommand = {
      Destination: { ToAddresses: mockAddresses },
      Message: {
        Body: { Html: { Charset: 'UTF-8', Data: mockBody } },
        Subject: { Charset: 'UTF-8', Data: mockSubject },
      },
      Source: mockSender,
      ReplyToAddresses: [mockSender],
    }

    it('should send email', async () => {
      const clientSendSpy = jest.spyOn(SESClient.prototype, 'send').mockResolvedValue({} as never);
      await expect(service.sendEmail(mockSender, mockAddresses, mockSubject, mockBody)).resolves.toBe(undefined);
      expect(SendEmailCommand).toBeCalledWith(expectCommand);
      expect(clientSendSpy).toBeCalledWith(expect.any(SendEmailCommand));
    });
  });
});
