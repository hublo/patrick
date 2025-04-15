FROM node:20-slim as builder
WORKDIR /usr/src/app
RUN npm --silent install --global --depth 0 pnpm
COPY pnpm-lock.yaml  .
RUN pnpm fetch
COPY package.json .
RUN pnpm i --offline --frozen-lockfile
COPY . .
RUN pnpm build

FROM amazon/aws-lambda-nodejs:20
ARG APP_ID
ENV APP_ID $APP_ID
ARG PRIVATE_KEY
ENV PRIVATE_KEY $PRIVATE_KEY
ARG WEBHOOK_SECRET
ENV WEBHOOK_SECRET $WEBHOOK_SECRET
# COPY --from=public.ecr.aws/datadog/lambda-extension:latest /opt/extensions/ /opt/extensions
RUN npm --silent install --global --depth 0 pnpm
COPY pnpm-lock.yaml  ${LAMBDA_TASK_ROOT}
RUN pnpm fetch --prod
COPY package.json ${LAMBDA_TASK_ROOT}
RUN pnpm i --prod --offline --frozen-lockfile && pnpm prune --prod --no-optional
ENV NODE_ENV="production"
COPY --from=builder /usr/src/app/lib ${LAMBDA_TASK_ROOT}
CMD [ "src/index.webhooks" ]