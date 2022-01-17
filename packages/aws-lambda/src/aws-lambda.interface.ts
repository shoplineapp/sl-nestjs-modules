import { CredentialProvider } from '@aws-sdk/types';

/**
 * The configuration interface of the AwsLambdaModule
 */
export type AwsLambdaOptions = {
  /**
   * The AWS region the Lambda is in
   */
  region?: string;
  /**
   * The AWS credentials to use with the AWS SDK
   */
  credentials?: CredentialProvider;
};

/**
 * The async configuration interface of the AwsLambdaModule
 */
export type AwsLambdaAsyncOptions = {
  /** Array of dependencies which will be injected to the `useFactory` function as arguments in the same order */
  inject: any[];
  /** Factory function to provide the `AwsLambdaOptions` for the module */
  useFactory: (...args: any[]) => AwsLambdaOptions | Promise<AwsLambdaOptions>;
};
