import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      'Effect': 'Allow',
      'Action': ['dynamodb:*'],
      'Resource': ["arn:aws:dynamodb:*:*:table/*"]
    },
  ],
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responses: {
          200: {
            description: 'Successful API response',
            bodyType: 'ProductList'
          },
          500: {
            description: 'Internal server error',
          }
        }
      },
    },
  ],
};
