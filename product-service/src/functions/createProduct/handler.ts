import schema from '@functions/schema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk'
import { Product } from '../../types/api-types';
import { PRODUCT_KEYS, STATUS_CODES } from '../../constants';

const isRequestValid = (product: Product) => {
  const { ID, TITLE, DESCRIPTION, PRICE } = PRODUCT_KEYS;
  let isValid = true;
  const keys = Object.keys(product);
  if (!(keys.length === 4 && product.hasOwnProperty(ID) && product.hasOwnProperty(TITLE) && product.hasOwnProperty(DESCRIPTION) && product.hasOwnProperty(PRICE))) {
    return false;
  }
  for (let key in product) {
    const isValidKey =
      product[key] &&
      ((key === PRICE && typeof product[key] === "number") ||
        (key !== PRICE && typeof product[key] === "string"));
    if (!isValidKey) {
      isValid = false;
      break;
    }
  }
  return isValid;
};

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { body }: any = event;
    console.log('createProduct called with parameters::', body);
    if (isRequestValid(body)) {
      const dynamo = new DynamoDB.DocumentClient();
      const data: any = await dynamo.put({
        TableName: process.env.PRODUCTS_TABLE,
        Item: body,
      }).promise();
      return formatJSONResponse(data);
    }
    else {
      return formatJSONResponse({ message: 'Invalid Request', statusCode: STATUS_CODES.BAD_REQUEST });
    }
  }
  catch (e) {
    return formatJSONResponse({ ...e, statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
};

export const main = middyfy(createProduct);
