import { Injectable } from '@nestjs/common';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { AwsLambdaFunctionError, AwsLambdaResponseError } from './aws-lambda.errors';

@Injectable()
export class AwsLambdaService {
  constructor(private readonly client: LambdaClient) {}

  /**
   * Invoke a AWS Lambda function
   * @param functionName Name of the AWS Lambda function
   * @param payload Payload to send to the AWS Lambda function
   * @returns Payload responded from the AWS Lambda function
   */
  async invoke(functionName: string, payload: Buffer): Promise<Uint8Array | undefined> {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: payload,
    });
    const output = await this.client.send(command);
    if (output.FunctionError) {
      throw new AwsLambdaFunctionError(output.FunctionError);
    }
    if (output.StatusCode < 200 || output.StatusCode > 299) {
      throw new AwsLambdaResponseError(output.StatusCode, output.Payload);
    }
    return output.Payload;
  }
}
