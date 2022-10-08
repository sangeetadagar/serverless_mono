import { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { PRODUCTS_LIST } from '../../../constants';
import { formatJSONResponse } from '@libs/api-gateway';

jest.mock('@libs/lambda');

describe('productList', () => {
  let main;
  let mockedMiddyfy: jest.MockedFunction<typeof middyfy>;

  beforeEach(async () => {
    mockedMiddyfy = jest.mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });

    main = (await import('../handler')).main;
  });

  it('should return productList', async () => {
    const actual = await main();
    expect(actual).toEqual(formatJSONResponse({
      statusCode: 200,
      body: PRODUCTS_LIST,
    }));
  });
});