import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductList } from 'src/types/api-types';
import { PRODUCTS_LIST, EMPTY_PRODUCT_LIST } from '../../constants';
import schema from '../schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const result: ProductList = await PRODUCTS_LIST;
    return formatJSONResponse({
      statusCode: 200,
      body: result && result.length ? result : { message: EMPTY_PRODUCT_LIST },
    });
  }
  catch (e) {
    return formatJSONResponse({
      statusCode: 500,
      message: e
    });
  }
};

export const main = middyfy(getProductsList);
