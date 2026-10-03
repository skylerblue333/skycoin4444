import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./env";
import { makeRequest } from "./map";

const originalApiUrl = ENV.forgeApiUrl;
const originalApiKey = ENV.forgeApiKey;

beforeEach(() => {
  ENV.forgeApiUrl = "https://forge.example.test";
  ENV.forgeApiKey = "test-maps-key";
});

afterEach(() => {
  ENV.forgeApiUrl = originalApiUrl;
  ENV.forgeApiKey = originalApiKey;
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Maps provider request boundary", () => {
  it("serializes multi-value parameters with pipes as documented", async () => {
    const fetchMock = vi.fn(
      async (input: URL | RequestInfo, init?: RequestInit) => {
        const url = new URL(String(input));
        expect(url.origin).toBe("https://forge.example.test");
        expect(url.pathname).toBe(
          "/v1/maps/proxy/maps/api/distancematrix/json",
        );
        expect(url.searchParams.get("key")).toBe("test-maps-key");
        expect(url.searchParams.get("origins")).toBe("NYC|Boston");
        expect(url.searchParams.get("alternatives")).toBe("false");
        expect(url.searchParams.get("timestamp")).toBe("123");
        expect(init?.method).toBe("GET");

        return new Response(JSON.stringify({ status: "OK" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      makeRequest("/maps/api/distancematrix/json", {
        origins: ["NYC", "Boston"],
        alternatives: false,
        timestamp: 123,
      }),
    ).resolves.toEqual({ status: "OK" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed endpoints before issuing a provider request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      makeRequest("https://evil.example.test/maps/api/geocode/json"),
    ).rejects.toThrow(/normalized absolute proxy path/);
    await expect(
      makeRequest("/maps/api/../admin"),
    ).rejects.toThrow(/normalized absolute proxy path/);
    await expect(
      makeRequest("/maps/api/geocode/json?key=override"),
    ).rejects.toThrow(/normalized absolute proxy path/);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unsupported parameter objects and non-finite numbers", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      makeRequest("/maps/api/geocode/json", {
        address: { city: "Boston" },
      }),
    ).rejects.toThrow(/must be a string, number, boolean, bigint/);

    await expect(
      makeRequest("/maps/api/geocode/json", {
        radius: Number.POSITIVE_INFINITY,
      }),
    ).rejects.toThrow(/must be finite/);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not reflect upstream error bodies into application errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("api_key=provider-secret", {
        status: 502,
        statusText: "Bad Gateway",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    let thrown: unknown;
    try {
      await makeRequest("/maps/api/geocode/json", {
        address: "Boston",
      });
    } catch (error) {
      thrown = error;
    }

    expect(String(thrown)).toContain("HTTP 502");
    expect(String(thrown)).not.toContain("provider-secret");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps the timeout active while consuming a successful response body", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn(
      async (_input: URL | RequestInfo, init?: RequestInit) => {
        const signal = init?.signal;
        return {
          ok: true,
          status: 200,
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

    const request = makeRequest("/maps/api/geocode/json", {
      address: "Boston",
    });
    const rejection = expect(request).rejects.toThrow(
      /timed out after 15000ms/,
    );

    await vi.advanceTimersByTimeAsync(15_000);
    await rejection;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails closed on invalid JSON and GET bodies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("not-json", {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
      ),
    );

    await expect(
      makeRequest("/maps/api/geocode/json"),
    ).rejects.toThrow(/returned invalid JSON/);

    await expect(
      makeRequest(
        "/maps/api/geocode/json",
        {},
        { method: "GET", body: { address: "Boston" } },
      ),
    ).rejects.toThrow(/GET requests cannot include a request body/);
  });
});
