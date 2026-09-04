import { describe, expect, it } from "vitest";
import {
  PRODUCTION_CONTENT_SECURITY_POLICY,
  securityHeadersFor,
} from "./securityHeaders";

describe("browser security headers", () => {
  it("adds transport and CSP controls only in production", () => {
    const production = securityHeadersFor({
      NODE_ENV: "production",
    } as NodeJS.ProcessEnv);
    const development = securityHeadersFor({
      NODE_ENV: "development",
    } as NodeJS.ProcessEnv);

    expect(production["Strict-Transport-Security"]).toBe(
      "max-age=31536000"
    );
    expect(production["Content-Security-Policy"]).toBe(
      PRODUCTION_CONTENT_SECURITY_POLICY
    );

    expect(development["Strict-Transport-Security"]).toBeUndefined();
    expect(development["Content-Security-Policy"]).toBeUndefined();
  });

  it("blocks framing, plugins, inline handler attributes, and unsafe eval", () => {
    const headers = securityHeadersFor({
      NODE_ENV: "production",
    } as NodeJS.ProcessEnv);
    const csp = headers["Content-Security-Policy"] ?? "";

    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("*");
  });

  it("keeps HMR-compatible development while preserving baseline headers", () => {
    const headers = securityHeadersFor({
      NODE_ENV: "development",
    } as NodeJS.ProcessEnv);

    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Cross-Origin-Resource-Policy"]).toBe("same-origin");
    expect(headers["Origin-Agent-Cluster"]).toBe("?1");
  });
});
