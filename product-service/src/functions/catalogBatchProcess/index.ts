import { handlerPath } from '@libs/handler-resolver';
import { CONFIG } from '../../../config';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      'Effect': 'Allow',
      'Action': ['dynamodb:*'],
      'Resource': ["arn:aws:dynamodb:*:*:table/*"]
    },
    {
      'Effect': 'Allow',
      'Action': ['sns:*'],
      'Resource': [`arn:aws:sns:${CONFIG.REGION}:${CONFIG.ACCOUNT_NUMBER}:${CONFIG.TOPIC_NAME}`]
    },
  ],
  events: [
    {
      sqs: ({
        arn: {
          "Fn::GetAtt": ["catalogItemsQueue", "Arn"]
        },
        batchSize: 5
      }),
    },
  ],
};