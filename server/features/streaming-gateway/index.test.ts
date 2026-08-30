import { describe, expect, it } from "vitest";
import { selectStreamRoute, toStreamRouteDecision } from "./index";

const routes = [
  { id: "b", protocol: "hls" as const, region: "us-east", priority: 20, healthy: true },
  { id: "a", protocol: "hls" as const, region: "us-east", priority: 10, healthy: true },
  { id: "c", protocol: "hls" as const, region: "eu-west", priority: 1, healthy: true },
];

describe("SkyStreamingGateway", () => {
  it("prefers a requested healthy region then lowest priority", () => {
    expect(selectStreamRoute(routes, "hls", "us-east").id).toBe("a");
  });

  it("falls back deterministically when the preferred region is unavailable", () => {
    expect(selectStreamRoute(routes, "hls", "ap-south").id).toBe("c");
  });

  it("rejects duplicate ids and unavailable protocols", () => {
    expect(() => selectStreamRoute([routes[0], { ...routes[0] }], "hls")).toThrow("duplicate route id: b");
    expect(() => selectStreamRoute(routes, "webrtc")).toThrow("no healthy stream route available");
  });

  it("emits a versioned provider-neutral route decision", () => {
    expect(toStreamRouteDecision(routes[1])).toEqual({
      type: "sky.streaming.route.v1",
      routeId: "a",
      protocol: "hls",
      region: "us-east",
    });
  });
});
