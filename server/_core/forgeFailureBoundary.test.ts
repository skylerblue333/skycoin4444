import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./env";
import { createHeartbeatJob } from "./heartbeat";
import { notifyOwner } from "./notification";

const originalForgeApiUrl = ENV.forgeApiUrl;
const originalForgeApiKey = ENV.forgeApiKey;

function warningText(spy: ReturnType<typeof vi.spyOn>) {
  return spy.mock.calls
    .flat()
    .map(value => String(value))
    .join(" ");
}

describe("Forge service failure boundaries", () => {
  beforeEach(() => {
    ENV.forgeApiUrl = "https://forge.example.invalid/base/";
    ENV.forgeApiKey = "test-forge-key";
  });

  afterEach(() => {
    ENV.forgeApiUrl = originalForgeApiUrl;
    ENV.forgeApiKey = originalForgeApiKey;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not reflect Heartbeat upstream bodies into client errors or logs", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response("Bearer upstream-secret password=provider-secret", {
          status: 503,
          statusText: "Service Unavailable",
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createHeartbeatJob(
        {
          name: "release-monitor",
          cron: "0 * * * * *",
          path: "/api/scheduled/release-monitor",
        },
        "",
      ),
    ).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Heartbeat CreateHeartbeatJob failed with upstream status 503.",
    });

    expect(warningText(warn)).not.toContain("upstream-secret");
    expect(warningText(warn)).not.toContain("provider-secret");

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("sanitizes Heartbeat network failures and returns a stable client message", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValue(
        new Error(
          "fetch https://admin:plainpass@forge.example.invalid/task?api_key=leaked Bearer abc.def.ghi",
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createHeartbeatJob(
        {
          name: "release-monitor",
          cron: "0 * * * * *",
          path: "/api/scheduled/release-monitor",
        },
        "",
      ),
    ).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "Heartbeat CreateHeartbeatJob service unavailable.",
    });

    const log = warningText(warn);
    expect(log).toContain("[redacted]");
    expect(log).not.toContain("plainpass");
    expect(log).not.toContain("leaked");
    expect(log).not.toContain("abc.def.ghi");
  });

  it("fails Heartbeat closed on malformed successful responses", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("not-json", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createHeartbeatJob(
        {
          name: "release-monitor",
          cron: "0 * * * * *",
          path: "/api/scheduled/release-monitor",
        },
        "",
      ),
    ).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "Heartbeat CreateHeartbeatJob returned an invalid response.",
    });
  });

  it("does not log Notification upstream bodies and uses a bounded request", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response("password=provider-secret Bearer raw-provider-token", {
          status: 502,
          statusText: "Bad Gateway",
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      notifyOwner({ title: "Release", content: "Provider check failed" }),
    ).resolves.toBe(false);

    const log = warningText(warn);
    expect(log).toContain("status 502");
    expect(log).not.toContain("provider-secret");
    expect(log).not.toContain("raw-provider-token");

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("sanitizes Notification network failures without changing fallback semantics", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValue(
        new Error(
          "POST https://user:plainpass@forge.example.invalid/send?token=leaked failed",
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      notifyOwner({ title: "Release", content: "Network boundary" }),
    ).resolves.toBe(false);

    const log = warningText(warn);
    expect(log).toContain("[redacted]");
    expect(log).not.toContain("plainpass");
    expect(log).not.toContain("leaked");
  });
});
