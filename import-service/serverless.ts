import type { AWS } from '@serverless/typescript';
import importProductsFile from '@functions/importProducts';
import importFileParser from '@functions/importFileParser';
import { CONFIG } from './config';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function', 'serverless-dotenv-plugin'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-west-2',
    stage: 'dev',
    iamRoleStatements: [
      {
        'Effect': 'Allow',
        'Action': ['s3:ListBucket'],
        'Resource': ["arn:aws:s3:::s3-integration-task-5"]
      },
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
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET: CONFIG.BUCKET,
      REGION: CONFIG.REGION,
      ACCOUNT_NUMBER: CONFIG.ACCOUNT_NUMBER
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
