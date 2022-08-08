#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { PersonalWebsiteStack } = require('../lib/cdk-stack');

const app = new cdk.App();
new PersonalWebsiteStack(app, 'PersonalWebsiteStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  certificateArn: 'arn:aws:acm:us-east-1:675985711616:certificate/f3f30b76-b7d3-496c-aab0-2f46428cd077',
  domainNames: ['marianomartinezgrasso.com', 'www.marianomartinezgrasso.com']
});
