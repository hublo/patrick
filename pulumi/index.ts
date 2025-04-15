import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx/classic/index.js'
import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()

const repository = new awsx.ecr.Repository('patrick-bot')

const image = repository.buildAndPushImage({
  context: '..',
  args: {
    APP_ID: config.requireSecret('APP_ID'),
    PRIVATE_KEY: config.requireSecret('PRIVATE_KEY'),
    WEBHOOK_SECRET: config.requireSecret('WEBHOOK_SECRET'),
  },
})

const iamForLambda = new aws.iam.Role('patrick-bot-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'lambda.amazonaws.com',
  }),
})

new aws.iam.RolePolicy('patrick-bot-policy', {
  role: iamForLambda.id,
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource:
          'arn:aws:secretsmanager:eu-central-1:637206260787:secret:datadog-lambdas-api-key-UMo5E4',
      },
    ],
  }),
})

new aws.iam.RolePolicyAttachment('patrick-bot-role-policy', {
  role: iamForLambda.name,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaExecute,
})

const lambda = new aws.lambda.Function('patrick-bot', {
  packageType: 'Image',
  imageUri: image,
  role: iamForLambda.arn,
  memorySize: 256,
  timeout: 10,
  environment: {
    variables: {
      // DD_LAMBDA_HANDLER: 'src/index.webhooks',
      // DD_SITE: 'datadoghq.eu',
      // DD_SERVICE: 'patrick-bot',
      // DD_ENV: 'prod',
      // DD_API_KEY_SECRET_ARN:
      //   'arn:aws:secretsmanager:eu-central-1:637206260787:secret:datadog-lambdas-api-key-UMo5E4',
      // DD_LOGS_CONFIG_PROCESSING_RULES:
      //   '[{"type": "exclude_at_match", "name": "exclude_start_and_end_logs", "pattern": "(START|END) RequestId"}]',
    },
  },
})

const lambdaUrl = new aws.lambda.FunctionUrl('patrick-bot-url', {
  functionName: lambda.name,
  authorizationType: 'NONE',
})

export const url = lambdaUrl.functionUrl
