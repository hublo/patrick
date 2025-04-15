import {
  createLambdaFunction,
  createProbot,
} from '@probot/adapter-aws-lambda-serverless'

import App from './app/index.js'

export const webhook: any = createLambdaFunction(App, {
  probot: createProbot(),
})
