/**
 * An error occurred during the AWS Lambda function execution
 */
export class AwsLambdaFunctionError extends Error {
  constructor(functionError: string) {
    super(`A AWS Lambda invocation failed with function error: ${functionError}`);
  }
}

/**
 * The AWS Lambda function responded with an erroneous status code that is not in the 200 range
 */
export class AwsLambdaResponseError extends Error {
  constructor(statusCode: number, payload: Uint8Array) {
    super(`A AWS Lambda invocation failed with status code ${statusCode}: ${payload}`);
  }
}
