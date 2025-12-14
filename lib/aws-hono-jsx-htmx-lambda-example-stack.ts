import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class AwsHonoJsxHtmxLambdaExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todoTable = new dynamodb.Table(this, 'Table', {
      tableName: 'aws-hono-jsx-htmx-lambda-example-todo',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: 'expire',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const functionName = 'aws-hono-jsx-htmx-lambda';
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: `/aws/lambda/${functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY,
    });

    const fn = new nodejs.NodejsFunction(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_24_X,
      architecture: lambda.Architecture.ARM_64,
      entry: './lambda/index.tsx',
      functionName,
      retryAttempts: 0,
      environment: {
        TABLE_NAME: todoTable.tableName,
      },
      bundling: {
        minify: true,
        sourceMap: false,
        keepNames: false,
        format: nodejs.OutputFormat.ESM,
      },
      role: new iam.Role(this, 'Role', {
        roleName: `${functionName}-role`,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
        inlinePolicies: {
          'DynamoDBAccessPolicy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                actions: [
                  'dynamodb:PutItem',
                  'dynamodb:Scan',
                  'dynamodb:DeleteItem',
                  'dynamodb:GetItem',
                  'dynamodb:Query',
                ],
                resources: [
                  todoTable.tableArn,
                  `${todoTable.tableArn}/*`,
                ],
                effect: iam.Effect.ALLOW,
              }),
            ],
          }),
        },
      }),
      logGroup,
    });
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
  }
}
