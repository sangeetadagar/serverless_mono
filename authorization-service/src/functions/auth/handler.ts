import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, PolicyDocument } from 'aws-lambda';
import { POLICY_ACCESS_OPTIONS } from '../../constants';
const generatePolicyDocument = (effect: string, resource: string): PolicyDocument => {
  return {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": effect,
        "Action": [
          "execute-api:Invoke"
        ],
        "Resource": [
          resource
        ]
      }
    ]
  }
}

const generateResponse = (principalId: string, effect: string, resource: string): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: generatePolicyDocument(effect, resource)
  }
}

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log('basicAuthorizer called::', event);
  const { authorizationToken, methodArn } = event;
  const principalId = 'test';
  const token = authorizationToken && Buffer.from(event.authorizationToken.split(' ')[1], 'base64').toString().split(':')[1];
  const response = token === process.env.sangeetadagar ? generateResponse(principalId, POLICY_ACCESS_OPTIONS.ALLOW, methodArn) :
    generateResponse(principalId, POLICY_ACCESS_OPTIONS.DENY, methodArn);
  console.log('res::', JSON.stringify(response));
  return response;
};

export const main = basicAuthorizer;
