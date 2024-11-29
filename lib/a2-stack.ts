import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class A2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const myBucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Remove bucket when stack is deleted (for dev/test environments only)
    });

    // Create a Lambda function
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X, // Updated to use supported Node.js runtime
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Lambda invoked!');
          return { statusCode: 200, body: 'Hello, World!' };
        }
      `),
      environment: {
        BUCKET_NAME: myBucket.bucketName, // Environment variable for bucket name
      },
    });

    // Grant the Lambda function permissions to access the S3 bucket
    myBucket.grantReadWrite(myLambda);

    // Create a DynamoDB table
    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'MyTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Remove table when stack is deleted (for dev/test environments only)
    });

    // Grant the Lambda function permissions to access the DynamoDB table
    myTable.grantFullAccess(myLambda);

    // Example resource comment (if needed)
    // const queue = new sqs.Queue(this, 'A2Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300),
    // });
  }
}
