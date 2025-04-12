import nock from "nock";
import myProbotApp from "../src/app/index.js";
import { Probot, ProbotOctokit } from "probot";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, beforeEach, afterEach, test, expect } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8"
);

const payload = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures/issue_comment.created.json"),
    "utf-8"
  )
);

describe("My Probot app", () => {
  let probot: Probot;

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    probot.load(myProbotApp);
  });

  test("creates a workflow dispatch event when a comment is made", async () => {
    const mock = nock("https://api.github.com")
      .post("/app/installations/2/access_tokens")
      .reply(200, {
        token: "test",
        permissions: {
          actions: "write",
        },
      })
      .post(
        "/repos/hublo/monorepo/actions/workflows/e2e-playwright-tests.yml/dispatches",
        () => true
      )
      .reply(200);

    await probot.receive({
      id: "abc123",
      name: "issue_comment",
      payload,
    });

    expect(mock.pendingMocks()).toMatchInlineSnapshot(`
      [
        "POST https://api.github.com:443/app/installations/2/access_tokens",
        "POST https://api.github.com:443/repos/hublo/monorepo/actions/workflows/e2e-playwright-tests.yml/dispatches",
      ]
    `);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
