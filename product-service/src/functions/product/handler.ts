import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from 'src/types/api-types';
import { PRODUCTS_LIST, PRODUCT_NOT_FOUND } from '../../constants';
import schema from '../schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const result = await PRODUCTS_LIST.filter(prod => prod.id.toString() === productId);
    const product: Product = result && result.length ? result[0] : null;
    return formatJSONResponse({
      statusCode: 200,
      body: product || { message: PRODUCT_NOT_FOUND }
    });
  }
  catch (e) {
    return formatJSONResponse({
      statusCode: 500,
      message: e
    });
  }
};

export const main = middyfy(getProductsById);
