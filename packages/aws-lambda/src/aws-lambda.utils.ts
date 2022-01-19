export type ConstructLambdaArnProps = {
  /** The partition the AWS Lambda is located in */
  partition?: string;
  /** The region the AWS Lambda is located in */
  region?: string;
  /** The AWS account ID that owns the Lambda */
  accountId: string;
  /** The name of the AWS Lambda */
  functionName: string;
};

/**
 * Construct the [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of a AWS Lambda function
 * @param props
 * @returns ARN of the Lambda
 */
export function constructLambdaArn({
  partition = 'aws',
  region = 'ap-southeast-1',
  accountId,
  functionName,
}: ConstructLambdaArnProps): string {
  return `arn:${partition}:lambda:${region}:${accountId}:function:${functionName}`;
}

/**
 * Convert an object into a `Buffer` that can be sent to the AWS Lambda as payload
 * @param object The object to send
 * @returns `Buffer` of the object in JSON format
 */
export function objectToPayload(object: Record<any, any>): Buffer {
  return Buffer.from(JSON.stringify(object));
}

/**
 * Convert a `Uint8Array` payload sent from AWS Lambda into an object
 * @param payload Uint8Array containing the JSON formatted string of a object
 * @returns The parsed object
 */
export function payloadToObject(payload: Uint8Array): Record<any, any> {
  return JSON.parse(Buffer.from(payload).toString());
}
