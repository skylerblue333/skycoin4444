import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { getV4Journey, v4Flagships, v4Missions } from "../../client/src/lib/v4Beta";

const pageSource = fs.readFileSync("client/src/pages/V4Beta.tsx", "utf8");
const workspaceSource = fs.readFileSync("client/src/pages/BetaWorkspace.tsx", "utf8");
const auditSource = fs.readFileSync("scripts/audit-v4-beta.mjs", "utf8");
const workflowSource = fs.readFileSync(".github/workflows/ci.yml", "utf8");

describe("V4 engineering-beta release contract", () => {
  it("launches V4 through the existing beta workspace without a duplicate router surface", () => {
    expect(workspaceSource).toContain('import V4Beta from "./V4Beta"');
    expect(workspaceSource).toContain("<V4Beta />");
    expect(pageSource).toContain("V4 engineering beta");
    expect(pageSource).toContain("Stop counting screens. Ship complete loops.");
    expect(pageSource).toContain("seven flagship experiences");
  });

  it("keeps the release centered on seven deep loops and forty-two evidence stages", () => {
    expect(v4Flagships).toHaveLength(7);
    expect(
      v4Flagships.reduce(
        (total, flagship) => total + getV4Journey(flagship.id).stages.length,
        0
      )
    ).toBe(42);
    expect(v4Missions).toHaveLength(5);
  });

  it("requires underlying six-stage evidence before a V4 tester pass", () => {
    expect(pageSource).toContain("journeyPercent === 100");
    expect(pageSource).toContain("finish stages first");
    expect(pageSource).toContain("eligible for tester pass");
    expect(pageSource).toContain("underlying journey checklist");
  });

  it("states that V4 local progress is not production proof", () => {
    expect(pageSource).toContain("V4 is not a production certification");
    expect(pageSource).toContain("tester-confirmed browser-local state");
    expect(pageSource).toContain("does not");
    expect(pageSource).toContain("prove uptime");
    expect(pageSource).toContain("security certification");
    expect(pageSource).toContain("regulatory approval");
  });

  it("keeps financial, Web3, AI, and live capability limits explicit", () => {
    const byId = new Map(v4Flagships.map(flagship => [flagship.id, flagship]));
    expect(byId.get("commerce")?.boundary).toMatch(/No real sellers.*payment/i);
    expect(byId.get("web3")?.boundary).toMatch(/No wallet connection.*signing.*custody/i);
    expect(byId.get("ai")?.boundary).toMatch(/No external model\/provider claim.*autonomous execution/i);
    expect(byId.get("live")?.boundary).toMatch(/small-room WebRTC.*no server ingest/i);
  });

  it("has a repository audit designed around evidence rather than route-count credit", () => {
    expect(auditSource).toContain("V4 flagship release audit");
    expect(auditSource).toContain("expectedFlagships");
    expect(auditSource).toContain("release contract lacks test assertions");
    expect(auditSource).toContain("this audit is not production certification");
    expect(workflowSource).toContain("V4 flagship release audit");
    expect(workflowSource).toContain("node scripts/audit-v4-beta.mjs");
  });
});
