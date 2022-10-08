import { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { PRODUCTS_LIST, PRODUCT_NOT_FOUND } from '../../../constants';
jest.mock('@libs/lambda');

describe('get product', () => {
  let main;
  let mockedMiddyfy: jest.MockedFunction<typeof middyfy>;

  beforeEach(async () => {
    mockedMiddyfy = jest.mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });

    main = (await import('../handler')).main;
  });

  it('should return product when id is present', async () => {
    const event = {
      pathParameters: {
        productId: "1"
      }
    } as any;
    const actual = await main(event);
    expect(actual).toEqual(formatJSONResponse({
      statusCode: 200,
      body: PRODUCTS_LIST[0],
    }));
  });
  it('should return product not found when id is not present', async () => {
    const event = {
      pathParameters: {
        productId: "23"
      }
    } as any;
    const actual = await main(event);
    expect(actual).toEqual(formatJSONResponse({
      statusCode: 200,
      body: { message: PRODUCT_NOT_FOUND },
    }));
  });
  it('should return error when there is some error', async () => {
    const actual = await main();
    expect(actual).toEqual(formatJSONResponse({
      statusCode: 500,
      message: {},
    }));
  });
});