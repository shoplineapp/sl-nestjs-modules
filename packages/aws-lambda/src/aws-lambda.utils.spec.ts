import { constructLambdaArn, ConstructLambdaArnProps, objectToPayload, payloadToObject } from './aws-lambda.utils';

describe('constructLambdaArn', () => {
  describe.each([
    [
      'with only accountId and functionName',
      { accountId: 'mock-account-id', functionName: 'mock-function-name' },
      'arn:aws:lambda:ap-southeast-1:mock-account-id:function:mock-function-name',
    ],
    [
      'with region, accountId, and functionName',
      { region: 'mock-region', accountId: 'mock-account-id', functionName: 'mock-function-name' },
      'arn:aws:lambda:mock-region:mock-account-id:function:mock-function-name',
    ],
    [
      'with partition, region, accountId, and functionName',
      {
        partition: 'mock-partition',
        region: 'mock-region',
        accountId: 'mock-account-id',
        functionName: 'mock-function-name',
      },
      'arn:mock-partition:lambda:mock-region:mock-account-id:function:mock-function-name',
    ],
  ])('%s', (_, mockProps: ConstructLambdaArnProps, expectedArn: string) => {
    test('return ARN of the Lambda', () => {
      expect(constructLambdaArn(mockProps)).toEqual(expectedArn);
    });
  });
});

describe('objectToPayload', () => {
  let mockObject: Record<any, any>;

  beforeEach(() => {
    mockObject = { foo: 'bar' };
  });
  test('return converted payload as Buffer', () => {
    let expectedPayload = Buffer.from('{"foo":"bar"}');
    expect(objectToPayload(mockObject)).toEqual(expectedPayload);
  });
});

describe('payloadToObject', () => {
  let mockPayload: Uint8Array;

  beforeEach(() => {
    mockPayload = new TextEncoder().encode('{"foo":"bar"}');
  });

  test('return parsed object', () => {
    let expectedObject = { foo: 'bar' };
    expect(payloadToObject(mockPayload)).toEqual(expectedObject);
  });
});
