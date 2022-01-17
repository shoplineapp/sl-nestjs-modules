import { Test } from '@nestjs/testing';
import { InvokeCommand, InvokeCommandOutput, LambdaClient } from '@aws-sdk/client-lambda';
import { AwsLambdaService } from './aws-lambda.service';
import { AwsLambdaFunctionError, AwsLambdaResponseError } from './aws-lambda.errors';

jest.mock('@aws-sdk/client-lambda');

describe('AwsLambdaService', () => {
  let awsLambdaService: AwsLambdaService;
  let lambdaClient: LambdaClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AwsLambdaService, LambdaClient],
    }).compile();

    awsLambdaService = module.get(AwsLambdaService);
    lambdaClient = module.get(LambdaClient);
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
      lambdaClientSendMock = jest.spyOn(lambdaClient, 'send').mockResolvedValue(mockOutput as never);
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
      describe("when the output's StatusCode is in the 200 range", () => {
        beforeEach(() => {
          mockOutput.StatusCode = 200;
        });

        test('resolve with parsed output payload', async () => {
          await expect(invoke()).resolves.toEqual(mockOutputPayload);
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
