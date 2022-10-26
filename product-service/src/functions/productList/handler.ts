import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk'
import { ProductList } from 'src/types/api-types';
import { EMPTY_PRODUCT_LIST, STATUS_CODES } from '../../constants';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<ProductList> = async () => {
  try {
    console.log('getProductsList called::');
    const dynamo = new DynamoDB.DocumentClient();
    const productsData: any = await dynamo.scan({
      TableName: process.env.PRODUCTS_TABLE,
    }).promise().then(result => result.Items);
    if (productsData && productsData.length > 0) {
      const stocksData: any = await dynamo.scan({
        TableName: process.env.STOCKS_TABLE,
      }).promise().then(result => result.Items);
      const finalData = productsData.map(product => ({ ...product, ...stocksData.find(stock => stock.product_id === product.id) }));
      return formatJSONResponse(finalData);

    } else {
      return formatJSONResponse({ message: EMPTY_PRODUCT_LIST, statusCode: STATUS_CODES.RESOURCE_NOT_FOUND });
    }
  }
  catch (e) {
    return formatJSONResponse({ ...e, statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
};

export const main = middyfy(getProductsList);
