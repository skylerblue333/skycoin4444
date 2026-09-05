import { afterEach, describe, expect, it, vi } from "vitest";
import { registerBetaAccessAuthRoutes } from "./betaAccessAuthRoutes";

type Handler = (
  req: Record<string, unknown>,
  res: Record<string, unknown>
) => void | Promise<void>;

function createFakeApp() {
  const routes: Record<string, Handler> = {};
  return {
    routes,
    get(path: string, handler: Handler) {
      routes[`GET ${path}`] = handler;
    },
    post(path: string, handler: Handler) {
      routes[`POST ${path}`] = handler;
    },
  };
}

function createResponse() {
  const body: {
    headers: Record<string, string>;
    payload?: unknown;
    statusCode?: number;
  } = { headers: {} };

  const response: Record<string, unknown> = {
    set(name: string, value: string) {
      body.headers[name] = value;
      return response;
    },
    status(code: number) {
      body.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      body.payload = payload;
      return response;
    },
    clearCookie() {
      return response;
    },
    cookie() {
      return response;
    },
  };

  return { body, response };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("beta access login route rate limit", () => {
  it("returns a generic 429 after the configured attempt threshold", async () => {
    vi.stubEnv("VITE_BETA_AUTH_MODE", "access_key");
    vi.stubEnv("BETA_ACCESS_KEY", "A".repeat(48));
    vi.stubEnv("BETA_ACCESS_MODE", "invite_only");
    vi.stubEnv("BETA_ALLOWED_EMAILS", "rate-limit-test@example.com");
    vi.stubEnv("BETA_ACCESS_RATE_LIMIT_WINDOW_MS", "10000");
    vi.stubEnv("BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS", "3");
    vi.stubEnv("BETA_ACCESS_RATE_LIMIT_MAX_KEYS", "128");
    vi.stubEnv("BETA_TRUSTED_CLIENT_IP_HEADER", "");

    const app = createFakeApp();
    registerBetaAccessAuthRoutes(app as never);
    const handler = app.routes["POST /api/beta/access-login"];

    const request = {
      body: {
        email: "rate-limit-test@example.com",
        accessKey: "B".repeat(48),
      },
      get() {
        return undefined;
      },
      socket: { remoteAddress: "192.0.2.55" },
      protocol: "https",
      headers: {},
    };

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { body, response } = createResponse();
      await handler(request, response);
      expect(body.statusCode).toBe(403);
      expect(body.payload).toEqual({
        error: "invalid invitation credentials",
      });
    }

    const { body, response } = createResponse();
    await handler(request, response);

    expect(body.statusCode).toBe(429);
    expect(body.headers["Retry-After"]).toBe("10");
    expect(body.payload).toMatchObject({
      error: "too many beta sign-in attempts",
      retryAfterSeconds: 10,
    });
  });
});
