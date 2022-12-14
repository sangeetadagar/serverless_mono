import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { PutObjectCommand, S3Client }
  from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    const clientParams = {
      region: process.env.REGION,
      apiVersion: "2006-03-01",
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    };
    const client = new S3Client(clientParams);
    const key = name || null;
    if (!key) {
      throw new Error("key not defined");
    }
    const getObjectParams = {
      Bucket: process.env.BUCKET,
      Key: `uploaded/${key}`,
      ContentType: 'text/csv'
    }
    const command = new PutObjectCommand(getObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return formatJSONResponse({
      url
    });
  }
  catch (e) {
    return formatJSONResponse({ ...e, err: true });
  }
};

export const main = middyfy(importProductsFile);
