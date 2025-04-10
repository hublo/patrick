# slash-e2e

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app to trigger e2e test from a PR

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t slash-e2e .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> slash-e2e
```

## Contributing

If you have suggestions for how slash-e2e could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2025 VivianHublo
