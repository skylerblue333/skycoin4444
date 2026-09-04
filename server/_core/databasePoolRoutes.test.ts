import { describe, expect, it } from "vitest";
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
    const response: Record<string, unknown> = {
      set(name: string, value: string) {
        body.headers[name] = value;
        return response;
      },
      json(payload: unknown) {
        body.payload = payload;
        return response;
      },
    };

    await routes["/api/runtime/database-pool"]?.({}, response);

    const payload = body.payload as Record<string, unknown>;
    expect(body.headers["Cache-Control"]).toBe("no-store");
    expect(payload).toMatchObject({
      contract: "skycoin4444.database-pool.v1",
      productionDatabaseVerified: false,
    });
    expect("databaseUrl" in payload).toBe(false);
    expect("host" in payload).toBe(false);
    expect("password" in payload).toBe(false);
  });
});
