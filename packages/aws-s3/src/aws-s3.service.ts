import { Inject, Injectable } from '@nestjs/common';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AwsS3GetObjectResponse, AwsS3Options } from './aws-s3.interfaces';
import { AWS_S3_OPTIONS } from './aws-s3.constants';

/** Service class providing interface to AWS S3 */
@Injectable()
export class AwsS3Service {
  private readonly client: S3Client;

  constructor(@Inject(AWS_S3_OPTIONS) options: AwsS3Options) {
    this.client = new S3Client(options);
  }

  /**
   * Get an object from an AWS S3 bucket
   * @param bucketName Name of the bucket
   * @param key Key of the object to get
   * @return Response from getting an S3 object
   */
  async getObject(bucketName: string, key: string): Promise<AwsS3GetObjectResponse> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const output = await this.client.send(command);
    return { data: output.Body };
  }
}
