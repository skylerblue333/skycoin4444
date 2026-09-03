import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync("client/src/pages/OperationalReadiness.tsx", "utf8");
const app = fs.readFileSync("client/src/App.tsx", "utf8");

describe("operational readiness evidence view", () => {
  it("is registered and uses the approved beta endpoints", () => {
    expect(app).toMatch(/path="\/operational-readiness" component=\{OperationalReadiness\}/);
    expect(source).toContain("/api/beta/health");
    expect(source).toContain("/api/beta/readiness");
    expect(source).toContain("cache: \"no-store\"");
  });

  it("does not infer unsupported operational or financial claims", () => {
    expect(source).toMatch(/does not estimate uptime, traffic, capacity, revenue, user activity/);
    expect(source).toMatch(/Financial settlement, custody, signing, transfer/);
    expect(source).toMatch(/Readiness is not authorization/);
    expect(source).not.toMatch(/99\.9|revenue:|followers:|transactions:/);
  });
});
