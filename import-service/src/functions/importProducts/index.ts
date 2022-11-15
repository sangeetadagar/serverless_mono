import { handlerPath } from '@libs/handler-resolver';
import { CONFIG } from '../../../config';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          arn: `arn:aws:lambda:${CONFIG.REGION}:${CONFIG.ACCOUNT_NUMBER}:function:authorization-service-dev-basicAuthorizer`,
          type: 'token',
          resultTtlInSeconds: 0,
        }
      },
    },
  ],
};
