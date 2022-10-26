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
        method: 'post',
        path: 'products',
        bodyType:'Product',
        cors: true,
        responses: {
          200: {
            description: 'Successful API response',
          },
          500: {
            description: 'Internal server error',
          }
        }
      },
    },
  ],
};
