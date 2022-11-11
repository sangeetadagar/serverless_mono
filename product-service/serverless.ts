import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/productList';
import getProductById from '@functions/product';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';
import { CONFIG } from './config';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger','serverless-esbuild','serverless-offline','serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-west-2',
    stage: 'dev',
    iamRoleStatements: [
      {
        'Effect': 'Allow',
        'Action': ['sqs:*'],
        'Resource': {
          "Fn::GetAtt": ["catalogItemsQueue", "Arn"]
        },
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: 'products',
      STOCKS_TABLE: 'stocks',
      ACCESS_KEY_ID: CONFIG.ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: CONFIG.SECRET_ACCESS_KEY,
      REGION: CONFIG.REGION,
      ACCOUNT_NUMBER: CONFIG.ACCOUNT_NUMBER,
      TOPIC_NAME: CONFIG.TOPIC_NAME
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
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
    autoswagger:{
      host: '31se4a8q61.execute-api.us-west-2.amazonaws.com/dev/',
      typefiles: ['./src/types/api-types.d.ts'],
    }
  },
  resources:{
Resources:{
  catalogItemsQueue:{
    Type: "AWS::SQS::Queue",
    Properties:{
      QueueName: "catalogItemsQueue"
    }
  },
  createProductTopic:{
    Type: "AWS::SNS::Topic",
    Properties:{
      TopicName: "createProductTopic",
      Subscription: [{
      Endpoint: "sangeetadagar808@gmail.com",
        Protocol: "email"
      }]
    }
  }
}
  }
};

module.exports = serverlessConfiguration;
