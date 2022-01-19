import { Test } from '@nestjs/testing';
import { CredentialProvider } from '@aws-sdk/types';
import { InvokeCommand, InvokeCommandOutput, LambdaClient } from '@aws-sdk/client-lambda';
import { AwsLambdaService } from './aws-lambda.service';
import { AwsLambdaFunctionError, AwsLambdaResponseError } from './aws-lambda.errors';
import { AwsLambdaInvokeResponse, AwsLambdaOptions } from './aws-lambda.interfaces';
import { AWS_LAMBDA_OPTIONS } from './aws-lambda.constants';

jest.mock('@aws-sdk/client-lambda');

describe('AwsLambdaService', () => {
  let mockRegion: string;
  let mockCredentials: CredentialProvider;
  let mockAwsLambdaOptions: AwsLambdaOptions;
  let awsLambdaService: AwsLambdaService;

  beforeEach(async () => {
    mockRegion = 'mock-region';
    mockCredentials = {} as never;
    mockAwsLambdaOptions = { region: mockRegion, credentials: mockCredentials };

    const module = await Test.createTestingModule({
      providers: [{ provide: AWS_LAMBDA_OPTIONS, useValue: mockAwsLambdaOptions }, AwsLambdaService],
    }).compile();

    awsLambdaService = module.get(AwsLambdaService);
  });

  test('create LambdaClient', () => {
    expect(LambdaClient).toBeCalledTimes(1);
    expect(LambdaClient).toBeCalledWith(mockAwsLambdaOptions);
  });

  describe('#invoke', () => {
    let mockFunctionName: string;
    let mockPayload: Buffer;
    let mockOutputPayload: Uint8Array;
    let mockOutput: InvokeCommandOutput;
    let lambdaClientSendMock: jest.SpyInstance;
    let invoke: () => any;

    beforeEach(() => {
      mockFunctionName = 'mock-function-name';
      mockPayload = Buffer.from('mock-buffer');
      mockOutputPayload = new Uint8Array();
      mockOutput = { Payload: mockOutputPayload } as never;
      lambdaClientSendMock = jest.spyOn(LambdaClient.prototype, 'send').mockResolvedValue(mockOutput as never);
      invoke = () => awsLambdaService.invoke(mockFunctionName, mockPayload);
    });

    test('call LambdaClient#send', async () => {
      await invoke().catch(() => undefined);
      expect(InvokeCommand).toBeCalledTimes(1);
      expect(InvokeCommand).toBeCalledWith({ FunctionName: mockFunctionName, Payload: mockPayload });
      const invokeCommand = (InvokeCommand as unknown as jest.SpyInstance).mock.instances[0];
      expect(lambdaClientSendMock).toBeCalledTimes(1);
      expect(lambdaClientSendMock).toBeCalledWith(invokeCommand);
    });

    describe('when the output has a FunctionError', () => {
      let mockFunctionError: string;

      beforeEach(() => {
        mockFunctionError = 'mock-function-error';
        mockOutput.FunctionError = mockFunctionError;
      });

      test('reject with AwsLambdaFunctionError', async () => {
        const expectedError = new AwsLambdaFunctionError(mockFunctionError);
        const error = await invoke().catch((error) => error);
        expect(error).toEqual(expectedError);
        expect(error).toBeInstanceOf(AwsLambdaFunctionError);
      });
    });

    describe('when the output does not have a FunctionError', () => {
      let mockStatusCode: number;
      describe("when the output's StatusCode is in the 200 range", () => {
        beforeEach(() => {
          mockStatusCode = 200;
          mockOutput.StatusCode = mockStatusCode;
        });

        test('resolve with parsed output payload', async () => {
          const expectedResponse: AwsLambdaInvokeResponse = { payload: mockOutputPayload, statusCode: mockStatusCode };
          await expect(invoke()).resolves.toEqual(expectedResponse);
        });
      });

      describe("when the output's StatusCode is not in the 200 range", () => {
        let mockStatusCode: number;

        beforeEach(() => {
          mockStatusCode = 400;
          mockOutput.StatusCode = mockStatusCode;
        });

        test('reject with AwsLambdaResponseError', async () => {
          const expectedError = new AwsLambdaResponseError(mockStatusCode, mockOutputPayload);
          const error = await invoke().catch((error) => error);
          expect(error).toEqual(expectedError);
          expect(error).toBeInstanceOf(AwsLambdaResponseError);
        });
      });
    });
  });
});
