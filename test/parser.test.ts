import { describe, expect, it } from "vitest";
import { parser } from "../src/app/parser";

describe("slash-e2e parser", () => {
  it('should return nothing if no "/e2e" command', () => {
    const body = "hello world";
    const result = parser(body);
    expect(result).toEqual(undefined);
  });
  it("should work with only /e2e, this will trigger everything on ng", () => {
    const body = "/e2e";
    const result = parser(body);
    expect(result).toMatchInlineSnapshot(`
      {
        "env": "ng",
        "front-matrix": "",
      }
    `);
  });
  it("should work with /e2e and a front-matrix", () => {
    const body = "/e2e front-hr-management";
    const result = parser(body);
    expect(result).toMatchInlineSnapshot(`
      {
        "env": "ng",
        "front-matrix": "front-hr-management",
      }
    `);
  });
  it("should work with /e2e, a front-matrix and env", () => {
    const body = "/e2e front-hr-management env3";
    const result = parser(body);
    expect(result).toMatchInlineSnapshot(`
      {
        "env": "env3",
        "front-matrix": "front-hr-management",
      }
    `);
  });
  it("should not work with /e2e, a fake front-matrix and a fake env", () => {
    const body = "/e2e daniel balavoine";
    const result = parser(body);
    expect(result).toEqual(undefined);
  });
});
