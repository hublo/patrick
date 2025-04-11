import pkg from "@probot/adapter-aws-lambda-serverless";
const { createLambdaFunction, createProbot } = pkg;

import App from "./app/index.js";

export const webhooks = createLambdaFunction(App, {
  probot: createProbot(),
});
