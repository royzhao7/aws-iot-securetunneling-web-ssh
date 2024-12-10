import { Stack, StackProps, CfnOutput, Duration, Aws} from 'aws-cdk-lib/core'
import {Construct} from 'constructs'
import { LambdaIntegration, RestApi ,EndpointType} from "aws-cdk-lib/aws-apigateway"
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources"
import { Code, Runtime, Function } from "aws-cdk-lib/aws-lambda"
import {Parameters} from '../parameters'

export class CdkWebSshStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

  

    // LAMBDA THAT SETS COOKIE
    const lambda_set_cookie_path = `${__dirname}/lambda/setCookie`
    const lambda_set_cookie = new Function(this, 'LambdaSetCookie', {
        runtime: Runtime.NODEJS_18_X,
        code: Code.fromAsset(lambda_set_cookie_path),
        handler: 'index.handler',
        timeout: Duration.seconds(15)  
    })

    // LAMBDA FOR CORS
    const lambda_cors_path = `${__dirname}/lambda/cors`
    const lambda_cors= new Function(this, 'LambdaCors', {
        runtime: Runtime.NODEJS_18_X,
        code: Code.fromAsset(lambda_cors_path),
        handler: 'index.handler',
        timeout: Duration.seconds(15)  
    })


    // API THAT SETS COOKIE 
    const api = new RestApi(this, 'ApiCookie',{
      endpointConfiguration: {
        types: [ EndpointType.REGIONAL ]
      }
    })
    const integration_set_cookie = new LambdaIntegration(lambda_set_cookie)
    api.root.addMethod('POST', integration_set_cookie, {apiKeyRequired: false})
    const integration_cors = new LambdaIntegration(lambda_cors)
    api.root.addMethod('OPTIONS', integration_cors, {apiKeyRequired: false})

    new CfnOutput(this, 'ApiCookieUrl', {
      value: api.url
    })


    new CfnOutput(this, 'AwsRegion', {
      value: Aws.REGION
    })

  }
}
