import schema from '@functions/schema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk'
import { STATUS_CODES } from '../../constants';
import { isRequestValid } from '@functions/createProduct/handler';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { Records }: any = event;
    console.log('catalogBatchProcess called with parameters::', JSON.stringify(event));
    await Promise.all(Records.map(async (record) => {
      const body = JSON.parse(record.body)[0];
      const product = {
        id: body.product_id,
        title: body.title,
        description: body.description,
        price: parseInt(body.price)
      }
      const isValid = isRequestValid(product);
      if (isValid) {
        const dynamo = new DynamoDB.DocumentClient();
        await dynamo.put({
          TableName: process.env.PRODUCTS_TABLE,
          Item: product,
        }).promise();
      }
    }));
    console.log('Products created');
    const clientParams = {
      region: process.env.REGION,
      apiVersion: "2006-03-01",
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    };
    console.log('SNS start::');
    const client = new SNSClient(clientParams);
    const res = await client.send(new PublishCommand({
      Message: 'Products are uploaded',
      TargetArn: `arn:aws:sns:${process.env.REGION}:${process.env.ACCOUNT_NUMBER}:${process.env.TOPIC_NAME}`
    }));
    console.log('message send to topic', res);
  }
  catch (e) {
    return formatJSONResponse({ ...e, statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
};

export const main = middyfy(catalogBatchProcess);
