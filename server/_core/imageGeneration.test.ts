import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { storagePutMock } = vi.hoisted(() => ({
  storagePutMock: vi.fn(),
}));

vi.mock("server/storage", () => ({
  storagePut: storagePutMock,
}));

import { ENV } from "./env";
import { generateImage, listImageModels } from "./imageGeneration";

const originalApiUrl = ENV.forgeApiUrl;
const originalApiKey = ENV.forgeApiKey;

beforeEach(() => {
  ENV.forgeApiUrl = "https://provider.example.test";
  ENV.forgeApiKey = "test-provider-key";
  storagePutMock.mockReset();
  storagePutMock.mockResolvedValue({
    key: "generated/test.png",
    url: "/manus-storage/generated/test.png",
  });
});

afterEach(() => {
  ENV.forgeApiUrl = originalApiUrl;
  ENV.forgeApiKey = originalApiKey;
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("image provider failure boundaries", () => {
  it("does not leak upstream error bodies into application errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("access_token=super-secret-provider-token", {
        status: 502,
        statusText: "Bad Gateway",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    let thrown: unknown;
    try {
      await generateImage({ prompt: "test" });
    } catch (error) {
      thrown = error;
    }

    expect(String(thrown)).toContain("502 Bad Gateway");
    expect(String(thrown)).not.toContain("super-secret-provider-token");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(storagePutMock).not.toHaveBeenCalled();
  });


  it("keeps the timeout active while consuming a successful response body", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn(
      async (_input: URL | RequestInfo, init?: RequestInit) => {
        const signal = init?.signal;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({ "content-type": "application/json" }),
          body: null,
          json: () =>
            new Promise<never>((_resolve, reject) => {
              signal?.addEventListener(
                "abort",
                () => reject(new DOMException("Aborted", "AbortError")),
                { once: true },
              );
            }),
        } as Response;
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = generateImage({ prompt: "timeout-test" });
    const rejection = expect(request).rejects.toThrow(
      /timed out after 120000ms/,
    );

    await vi.advanceTimersByTimeAsync(120_000);
    await rejection;

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(storagePutMock).not.toHaveBeenCalled();
  });

  it("cancels non-success response bodies without exposing them", async () => {
    const cancel = vi.fn();
    const body = new ReadableStream({
      cancel() {
        cancel();
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(body, {
          status: 503,
          statusText: "Service Unavailable",
        }),
      ),
    );

    await expect(generateImage({ prompt: "test" })).rejects.toThrow(
      /503 Service Unavailable/,
    );
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("rejects unsupported provider MIME types before storage", async () => {
    const b64Json = Buffer.from("<html>not an image</html>").toString("base64");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            image: {
              b64Json,
              mimeType: "text/html",
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    );

    await expect(generateImage({ prompt: "test" })).rejects.toThrow(
      /unsupported image MIME type/,
    );
    expect(storagePutMock).not.toHaveBeenCalled();
  });

  it("stores only validated image bytes", async () => {
    const imageBytes = Buffer.from("deterministic-image-bytes");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            image: {
              b64Json: imageBytes.toString("base64"),
              mimeType: "image/png",
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    );

    await expect(generateImage({ prompt: "test" })).resolves.toEqual({
      url: "/manus-storage/generated/test.png",
    });

    expect(storagePutMock).toHaveBeenCalledTimes(1);
    const [, storedBytes, mimeType] = storagePutMock.mock.calls[0];
    expect(Buffer.isBuffer(storedBytes)).toBe(true);
    expect(Buffer.compare(storedBytes, imageBytes)).toBe(0);
    expect(mimeType).toBe("image/png");
  });

  it("fails closed on malformed model-list payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ models: "not-an-array" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    await expect(listImageModels()).rejects.toThrow(/invalid models list/);
  });
});
