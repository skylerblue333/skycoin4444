import { describe, expect, it, vi } from "vitest";
import {
  UpstreamHttpError,
  createUpstreamHttpError,
} from "./providerErrorBoundary";

describe("provider error boundary", () => {
  it("returns only operation and status while cancelling the body", async () => {
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(
          new TextEncoder().encode("secret-provider-token=should-not-leak")
        );
      },
      cancel,
    });
    const response = new Response(body, {
      status: 502,
      statusText: "provider exploded",
    });

    const error = await createUpstreamHttpError(
      response,
      "Data API request"
    );

    expect(error).toBeInstanceOf(UpstreamHttpError);
    expect(error.status).toBe(502);
    expect(error.operation).toBe("Data API request");
    expect(error.message).toBe(
      "Data API request failed with upstream status 502"
    );
    expect(error.message).not.toContain("secret-provider-token");
    expect(error.message).not.toContain("provider exploded");
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("handles an upstream response without a readable body", async () => {
    const response = new Response(null, { status: 503 });

    await expect(
      createUpstreamHttpError(response, "Storage presign")
    ).resolves.toMatchObject({
      status: 503,
      operation: "Storage presign",
      message: "Storage presign failed with upstream status 503",
    });
  });
});
