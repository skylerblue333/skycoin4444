import { describe, expect, it } from "vitest";
import { parseCookieHeader } from "./cookieParser";

describe("parseCookieHeader", () => {
  it("parses a standard HTTP Cookie header through the installed package adapter", () => {
    expect(parseCookieHeader("session=abc123; theme=dark")).toMatchObject({
      session: "abc123",
      theme: "dark",
    });
  });

  it("returns an empty cookie object for an empty header", () => {
    expect(parseCookieHeader("")).toMatchObject({});
  });
});
