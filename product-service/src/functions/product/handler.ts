import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk'
import { Product } from 'src/types/api-types';
import { PRODUCT_NOT_FOUND, STATUS_CODES } from '../../constants';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<Product> = async (event) => {
  try {
    console.log('getProductsById called with parameters::', event.pathParameters);
    const dynamo = new DynamoDB.DocumentClient();
    const { productId } = event.pathParameters;
    const data: any = await dynamo.query({
      TableName: process.env.PRODUCTS_TABLE,
      KeyConditionExpression: 'id=:id',
      ExpressionAttributeValues: { ':id': productId },
    }).promise().then(result => result.Items);
    return formatJSONResponse(
      data && data.length > 0 ? data[0] : { message: PRODUCT_NOT_FOUND, statusCode: STATUS_CODES.RESOURCE_NOT_FOUND }
    );
  }
  catch (e) {
    return formatJSONResponse({ ...e, statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
};

export const main = middyfy(getProductsById);
