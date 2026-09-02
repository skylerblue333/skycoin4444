import { describe, expect, it, vi } from "vitest";
import { registerBetaRoutes } from "./betaRoutes";
import { db } from "../db";

type Handler = (req: unknown, res: Record<string, unknown>) => void | Promise<void>;

type FakeApp = {
  routes: Record<string, Handler>;
  get: (path: string, handler: Handler) => void;
};

function createFakeApp(): FakeApp {
  const app: FakeApp = {
    routes: {},
    get(path, handler) {
      app.routes[path] = handler;
    },
  };
  return app;
}

function createResponse() {
  const body: { headers: Record<string, string>; payload?: unknown; statusCode?: number } = {
    headers: {},
  };
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
  };
  return { body, response };
}

describe("beta status routes", () => {
  it("reports the invitation-only channel and non-live execution boundary", () => {
    const app = createFakeApp();
    registerBetaRoutes(app as never);
    const { body, response } = createResponse();

    app.routes["/api/beta/health"]({}, response);

    expect(body.payload).toMatchObject({
      status: "ok",
      releaseChannel: "invitation-only-engineering-beta",
      catalogAreas: 30,
      liveFinancialOrChainExecution: false,
    });
  });

  it("reports ready only when the database probe succeeds", async () => {
    const app = createFakeApp();
    registerBetaRoutes(app as never);
    const { body, response } = createResponse();
    const execute = vi.spyOn(db, "execute").mockResolvedValueOnce([] as never);

    await app.routes["/api/beta/readiness"]({}, response);

    expect(execute).toHaveBeenCalledOnce();
    expect(body.payload).toMatchObject({ status: "ready", database: "ok", liveFinancialOrChainExecution: false });
    execute.mockRestore();
  });

  it("fails closed when the database probe is unavailable", async () => {
    const app = createFakeApp();
    registerBetaRoutes(app as never);
    const { body, response } = createResponse();
    const execute = vi.spyOn(db, "execute").mockRejectedValueOnce(new Error("database offline"));

    await app.routes["/api/beta/readiness"]({}, response);

    expect(body.statusCode).toBe(503);
    expect(body.payload).toMatchObject({ status: "not_ready", database: "unavailable", liveFinancialOrChainExecution: false });
    execute.mockRestore();
  });

  it("serves all registered areas with no-store caching", () => {
    const app = createFakeApp();
    registerBetaRoutes(app as never);
    const { body, response } = createResponse();

    app.routes["/api/beta/areas"]({}, response);
    const payload = body.payload as { areas: Array<{ id: string }> };

    expect(body.headers["Cache-Control"]).toBe("no-store");
    expect(payload.areas).toHaveLength(30);
    expect(new Set(payload.areas.map(area => area.id)).size).toBe(30);
  });
});
