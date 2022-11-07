import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import schema from './schema';
import * as AWS from 'aws-sdk';
const csv = require('csvtojson');
const s3 = new AWS.S3({ region: process.env.REGION });
const sqs = new AWS.SQS({ region: process.env.REGION });

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('importFileParser...');
  let statusCode = 200;
  let body = {};

  const Bucketparams = {
    Bucket: process.env.BUCKET,
    Prefix: 'uploaded/',
  };

  try {
    const s3Response = await s3.listObjectsV2(Bucketparams).promise();
    const csvFiles = (s3Response.Contents ?? []).filter(file => file.Size);
    for (const file of csvFiles) {
      console.log('File key...', file.Key);
      const paramsForFile = {
        Bucket: process.env.BUCKET,
        Key: `${file.Key}`
      }
      const s3Stream = s3.getObject(paramsForFile).createReadStream();
      const json = await csv().fromStream(s3Stream);
      console.log(json);
      const result = await sqs.sendMessage({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify(json)

      }).promise();
      console.log('Result::', JSON.stringify(result));
    }
  } catch (err) {
    console.error('Error appears:');
    console.error(err);
    statusCode = 500;
    body = err;
  }
  return formatJSONResponse({
    statusCode,
    body,
    event,
  });
};

export const main = importFileParser;
