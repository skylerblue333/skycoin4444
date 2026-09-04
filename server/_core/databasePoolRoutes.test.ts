import { describe, expect, it, vi } from "vitest";
import { registerDatabasePoolRoutes } from "./databasePoolRoutes";

type Handler = (
  req: unknown,
  res: Record<string, unknown>
) => void | Promise<void>;

describe("database pool diagnostics", () => {
  it("exposes only non-secret pool state", async () => {
    const routes: Record<string, Handler> = {};
    const app = {
      get(path: string, handler: Handler) {
        routes[path] = handler;
      },
    };
    const body: {
      payload?: unknown;
      headers: Record<string, string>;
    } = { headers: {} };

    const set = vi.fn((name: string, value: string) => {
      body.headers[name] = value;
      return response;
    });
    const response: Record<string, unknown> = {
      set,
      json(payload: unknown) {
        body.payload = payload;
        return response;
      },
    };

    registerDatabasePoolRoutes(app as never);
    const handler = routes["/api/runtime/database-pool"];
    expect(handler).toBeTypeOf("function");

    await handler({}, response);

    expect(set).toHaveBeenCalledWith(
      "Cache-Control",
      "no-store"
    );
    expect(body.headers["Cache-Control"]).toBe("no-store");

    const payload = body.payload as Record<string, unknown>;
    expect(payload).toMatchObject({
      contract: "skycoin4444.database-pool.v1",
      productionDatabaseVerified: false,
      options: {
        queueLimit: 256,
      },
    });
    expect("databaseUrl" in payload).toBe(false);
    expect("host" in payload).toBe(false);
    expect("password" in payload).toBe(false);
    expect(JSON.stringify(payload)).not.toContain("DATABASE_URL");
  });
});
