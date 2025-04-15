import {
  createLambdaFunction,
  createProbot,
} from '@probot/adapter-aws-lambda-serverless'

import App from './app/index.js'

createLambdaFunction(App, { probot: createProbot() })
