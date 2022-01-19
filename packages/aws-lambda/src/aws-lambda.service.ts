import { Injectable } from '@nestjs/common';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { AwsLambdaFunctionError, AwsLambdaResponseError } from './aws-lambda.errors';
import { AwsLambdaInvokeResponse } from './aws-lambda.interfaces';

/** Service class providing interface to AWS Lambda */
@Injectable()
export class AwsLambdaService {
  constructor(private readonly client: LambdaClient) {}

  /**
   * Invoke a AWS Lambda function
   * @param functionName Either the ARN or the name of the AWS Lambda function. See [here](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html#API_Invoke_RequestSyntax) for more details
   * @param payload Payload to send to the AWS Lambda function
   * @returns Payload responded from the AWS Lambda function
   */
  async invoke(functionName: string, payload: Buffer): Promise<AwsLambdaInvokeResponse> {
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
    return { payload: output.Payload, statusCode: output.StatusCode };
  }
}
