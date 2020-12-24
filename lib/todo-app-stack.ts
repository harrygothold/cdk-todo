import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import { TodoBackend } from './todo-backend';
import { SPADeploy } from 'cdk-spa-deploy';

export class TodoAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todoBackend = new TodoBackend(this, "TodoBackend");

    new apiGateway.LambdaRestApi(this, 'Endpoint', {
      handler: todoBackend.handler,
    });

    const logoBucket = new s3.Bucket(this, 'LogoBucket', {
      publicReadAccess: true
    });

    new s3Deployment.BucketDeployment(this, 'DeployLogo', {
      destinationBucket: logoBucket,
      sources: [s3Deployment.Source.asset('./assets')]
    });

    new cdk.CfnOutput(this, "LogoPath", {
      value: `https://${logoBucket.bucketDomainName}/logo.png`
    });

    // const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
    //   publicReadAccess: true,
    //   websiteIndexDocument: 'index.html'
    // });

    // new s3Deployment.BucketDeployment(this, 'DeployWebsite', {
    //   destinationBucket: websiteBucket,
    //   sources: [s3Deployment.Source.asset('../frontend/build')]
    // });

    // new cdk.CfnOutput(this, "WebsiteAddress", {
    //   value: websiteBucket.bucketWebsiteUrl
    // });

    new SPADeploy(this, "WebsiteDeploy").createSiteWithCloudfront({
      indexDoc: "index.html",
      websiteFolder: "../frontend/build"
    });
  }
}
