import { Blob } from 'buffer';
import { Readable } from 'stream';
import { CredentialProvider } from '@aws-sdk/types';

/**
 * The configuration interface of the `AwsS3Module`
 */
export type AwsS3Options = {
  /**
   * The AWS region the S3 bucket is in
   */
  region?: string;
  /**
   * The AWS credentials to use with the AWS SDK
   */
  credentials?: CredentialProvider;
};

/**
 * The async configuration interface of the `AwsS3Module`
 */
export type AwsS3AsyncOptions = {
  /** Array of dependencies which will be injected to the `useFactory` function as arguments in the same order */
  inject: any[];
  /** Factory function to provide the `AwsS3Options` for the module */
  useFactory: (...args: any[]) => AwsS3Options | Promise<AwsS3Options>;
};

/**
 * The response from getting an object from a AWS S3 bucket
 */
export type AwsS3GetObjectResponse = {
  /** Object data */
  data: Readable | ReadableStream | Blob;
};
