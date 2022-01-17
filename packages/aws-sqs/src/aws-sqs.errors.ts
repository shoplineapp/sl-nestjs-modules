export class AwsLambdaFunctionError extends Error {
  constructor(functionError: string) {
    super(`A AWS Lambda invocation failed with function error: ${functionError}`);
  }
}

export class AwsLambdaResponseError extends Error {
  constructor(statusCode: number, payload: any) {
    super(`A AWS Lambda invocation failed with status code ${statusCode}: ${payload}`);
  }
}
