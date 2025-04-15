import pkg from '@probot/adapter-aws-lambda-serverless'
const { createProbot, createLambdaFunction } = pkg
import App from './app/index.js'

export const webhooks: any = createLambdaFunction(App, {
  probot: createProbot(),
})
