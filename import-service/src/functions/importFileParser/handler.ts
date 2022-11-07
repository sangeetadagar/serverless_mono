import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import * as AWS from 'aws-sdk';
import * as csvParser from 'csv-parser';

const s3 = new AWS.S3({ region: 'us-west-2' });
const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    const key = name || null;
    if (!key) {
      throw new Error("key not defined");
    }
    const getObjectParams = {
      Bucket: 's3-integration-task-5',
      Key: `uploaded/${key}`,
      ContentType: 'text/csv'
    }
    const s3Stream = await s3.getObject(getObjectParams).createReadStream();
    s3Stream
      .pipe(csvParser()).on('data', (data) => {
        console.log(data);
      }).on('error', (e) => {
        return formatJSONResponse({
          e,
          err: true
        });
      }).on('end', (data) => {
        return formatJSONResponse({
          message: `Hello welcome to the exciting Serverless world!`,
          data,
        });
      });
  }
  catch (e) {
    return formatJSONResponse({ ...e, err: true });
  }
};

export const main = middyfy(importFileParser);
