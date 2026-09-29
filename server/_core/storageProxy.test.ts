import { describe, expect, it } from "vitest";
import { normalizeStorageRedirectUrl } from "./storageProxy";

describe("storage proxy redirect boundary", () => {
  it("accepts HTTPS signed URLs without credentials", () => {
    expect(
      normalizeStorageRedirectUrl(
        "https://storage.example/object/file.png?signature=abc",
        { NODE_ENV: "production" } as NodeJS.ProcessEnv
      )
    ).toBe("https://storage.example/object/file.png?signature=abc");
  });

  it("preserves signature-sensitive URL representation after validation", () => {
    const signed =
      "https://Storage.Example:443/a/../signed/%2E%2E/object?X-Signature=ABC%2F123";

    expect(
      normalizeStorageRedirectUrl(
        `  ${signed}  `,
        { NODE_ENV: "production" } as NodeJS.ProcessEnv
      )
    ).toBe(signed);
  });

  it("rejects non-web schemes and credential-bearing URLs", () => {
    const env = { NODE_ENV: "production" } as NodeJS.ProcessEnv;

    expect(
      normalizeStorageRedirectUrl("javascript:alert(1)", env)
    ).toBeNull();
    expect(
      normalizeStorageRedirectUrl("data:text/html,boom", env)
    ).toBeNull();
    expect(
      normalizeStorageRedirectUrl(
        "https://user:password@storage.example/object",
        env
      )
    ).toBeNull();
  });

  it("rejects insecure remote redirects in production", () => {
    expect(
      normalizeStorageRedirectUrl(
        "http://storage.example/object",
        { NODE_ENV: "production" } as NodeJS.ProcessEnv
      )
    ).toBeNull();
  });

  it("allows loopback HTTP only outside production", () => {
    const env = { NODE_ENV: "development" } as NodeJS.ProcessEnv;

    expect(
      normalizeStorageRedirectUrl(
        "http://localhost:9000/object",
        env
      )
    ).toBe("http://localhost:9000/object");
    expect(
      normalizeStorageRedirectUrl(
        "http://127.0.0.1:9000/object",
        env
      )
    ).toBe("http://127.0.0.1:9000/object");
    expect(
      normalizeStorageRedirectUrl(
        "http://storage.example/object",
        env
      )
    ).toBeNull();
  });

  it("rejects missing and malformed redirect values", () => {
    expect(normalizeStorageRedirectUrl(undefined)).toBeNull();
    expect(normalizeStorageRedirectUrl("not a url")).toBeNull();
  });
});
