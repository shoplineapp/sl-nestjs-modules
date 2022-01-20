import { Blob } from 'buffer';
import { Test } from '@nestjs/testing';
import { CredentialProvider } from '@aws-sdk/types';
import { GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Options } from './aws-s3.interfaces';
import { AWS_S3_OPTIONS } from './aws-s3.constants';

jest.mock('@aws-sdk/client-s3');

describe('AwsS3Service', () => {
  let mockRegion: string;
  let mockCredentials: CredentialProvider;
  let mockAwsS3Options: AwsS3Options;
  let awsS3Service: AwsS3Service;

  beforeEach(async () => {
    mockRegion = 'mock-region';
    mockCredentials = {} as never;
    mockAwsS3Options = { region: mockRegion, credentials: mockCredentials };

    const module = await Test.createTestingModule({
      providers: [{ provide: AWS_S3_OPTIONS, useValue: mockAwsS3Options }, AwsS3Service],
    }).compile();

    awsS3Service = module.get(AwsS3Service);
  });

  test('create S3Client', () => {
    expect(S3Client).toBeCalledTimes(1);
    expect(S3Client).toBeCalledWith(mockAwsS3Options);
  });

  describe('#getObject', () => {
    let mockBucketName: string;
    let mockKey: string;
    let mockData: Blob;
    let mockOutput: GetObjectCommandOutput;
    let s3ClientSendSpy: jest.SpyInstance;
    let getObject: () => any;

    beforeEach(() => {
      mockBucketName = 'mock-bucket-name';
      mockKey = 'mock-key';
      mockData = new Blob([]);
      mockOutput = { Body: mockData } as never;
      s3ClientSendSpy = jest.spyOn(S3Client.prototype, 'send').mockResolvedValue(mockOutput as never);
      getObject = () => awsS3Service.getObject(mockBucketName, mockKey);
    });

    test('call S3Client#send', async () => {
      await getObject();
      expect(GetObjectCommand).toBeCalledTimes(1);
      expect(GetObjectCommand).toBeCalledWith({ Bucket: mockBucketName, Key: mockKey });
      const getObjectCommand = (GetObjectCommand as unknown as jest.SpyInstance).mock.instances[0];
      expect(s3ClientSendSpy).toBeCalledTimes(1);
      expect(s3ClientSendSpy).toBeCalledWith(getObjectCommand);
    });

    test('return GetObjectCommandOutput', async () => {
      await expect(getObject()).resolves.toEqual(mockOutput);
    });
  });
});
