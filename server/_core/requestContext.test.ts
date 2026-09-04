import { describe, expect, it } from "vitest";
import {
  getRequestContext,
  getRequestId,
  runWithRequestContext,
} from "./requestContext";

describe("request context", () => {
  it("propagates correlation data across async boundaries", async () => {
    await runWithRequestContext(
      {
        requestId: "req-123",
        startedAt: 100,
        method: "GET",
        path: "/api/test",
      },
      async () => {
        await Promise.resolve();
        expect(getRequestId()).toBe("req-123");
        expect(getRequestContext()?.path).toBe("/api/test");
      }
    );

    expect(getRequestContext()).toBeUndefined();
  });

  it("isolates concurrent request contexts", async () => {
    const read = async (requestId: string, delay: number) =>
      runWithRequestContext(
        {
          requestId,
          startedAt: 0,
          method: "GET",
          path: "/" + requestId,
        },
        async () => {
          await new Promise(resolve => setTimeout(resolve, delay));
          return getRequestId();
        }
      );

    await expect(Promise.all([read("alpha", 5), read("beta", 1)])).resolves.toEqual([
      "alpha",
      "beta",
    ]);
  });
});
