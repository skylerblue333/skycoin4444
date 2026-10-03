import { describe, expect, it, vi } from "vitest";
import {
  createStorageProxyRequestInit,
  normalizeStorageRedirectUrl,
  STORAGE_PROXY_REQUEST_TIMEOUT_MS,
} from "./storageProxy";

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


describe("storage proxy upstream request boundary", () => {
  it("applies the bounded Forge request timeout and bearer credential", () => {
    const controller = new AbortController();
    const timeout = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(controller.signal);

    try {
      const init = createStorageProxyRequestInit("test-forge-key");

      expect(timeout).toHaveBeenCalledWith(STORAGE_PROXY_REQUEST_TIMEOUT_MS);
      expect(init.signal).toBe(controller.signal);
      expect(new Headers(init.headers).get("authorization")).toBe(
        "Bearer test-forge-key"
      );
    } finally {
      timeout.mockRestore();
    }
  });
});
