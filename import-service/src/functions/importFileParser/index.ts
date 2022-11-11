import { handlerPath } from '@libs/handler-resolver';
import { CONFIG } from '../../../config';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      'Effect': 'Allow',
      'Action': ['s3:*'],
      'Resource': ["arn:aws:s3:::s3-integration-task-5", "arn:aws:s3:::s3-integration-task-5/*"]
    },
    {
      'Effect': 'Allow',
      'Action': ['sqs:*'],
      'Resource': [`arn:aws:sqs:${CONFIG.REGION}:${CONFIG.ACCOUNT_NUMBER}:catalogItemsQueue`]
    },
  ],
  events: [
    {
      s3: {
        bucket: 's3-integration-task-5',
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: 'uploaded/'
        }],
        existing: true,
      },
    },
  ],
};
