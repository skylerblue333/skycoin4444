import { describe, expect, it } from "vitest";
import {
  createBetaReadinessHandler,
  createCoordinatedBetaReadinessHandler,
  registerBetaRoutes,
} from "./betaRoutes";

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
    const { body, response } = createResponse();
    const handler = createBetaReadinessHandler(async () => undefined);

    await handler({}, response);

    expect(body.payload).toMatchObject({ status: "ready", database: "ok", liveFinancialOrChainExecution: false });
  });

  it("fails closed when the database probe is unavailable", async () => {
    const { body, response } = createResponse();
    const handler = createBetaReadinessHandler(async () => { throw new Error("database offline"); });

    await handler({}, response);

    expect(body.statusCode).toBe(503);
    expect(body.payload).toMatchObject({ status: "not_ready", database: "unavailable", configuration: "ok", liveFinancialOrChainExecution: false });
  });

  it("fails closed before the database probe when production configuration is invalid", async () => {
    const { body, response } = createResponse();
    let databaseProbed = false;
    const handler = createBetaReadinessHandler(
      async () => {
        databaseProbed = true;
      },
      () => [{ key: "JWT_SECRET", message: "too short" }]
    );

    await handler({}, response);

    expect(databaseProbed).toBe(false);
    expect(body.statusCode).toBe(503);
    expect(body.payload).toMatchObject({
      status: "not_ready",
      database: "unknown",
      configuration: "invalid",
      configurationIssueKeys: ["JWT_SECRET"],
      liveFinancialOrChainExecution: false,
    });
  });

  it("uses the shared dependency assessor while preserving beta fields", async () => {
    const { body, response } = createResponse();
    const handler = createCoordinatedBetaReadinessHandler({
      async assess() {
        return {
          contract: "skycoin4444.dependency-readiness.v1",
          status: "ready",
          degraded: true,
          checkedAt: "2026-09-04T00:00:00.000Z",
          configuration: { status: "ok", issueKeys: [] },
          database: { status: "ok" },
          eventDispatcher: { status: "degraded", required: false },
          productionCertification: false,
        };
      },
    });

    await handler({}, response);

    expect(body.statusCode).toBe(200);
    expect(body.headers["Cache-Control"]).toBe("no-store");
    expect(body.payload).toMatchObject({
      status: "ready",
      database: "ok",
      configuration: "ok",
      dependencyReadiness: {
        status: "ready",
        degraded: true,
      },
      liveFinancialOrChainExecution: false,
    });
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
