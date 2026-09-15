import { describe, expect, it } from "vitest";
import routeCatalog from "@/data/routeCatalog.json";
import {
  getV4Journey,
  getV4MissionProgress,
  normalizeV4TestSession,
  setV4FlagshipComplete,
  setV4Mission,
  v4Flagships,
  v4Missions,
} from "./v4Beta";

describe("V4 beta flagship manifest", () => {
  it("contains exactly the seven deep product loops", () => {
    expect(v4Flagships.map(flagship => flagship.id)).toEqual([
      "social",
      "gaming",
      "live",
      "commerce",
      "learning",
      "ai",
      "web3",
    ]);
    expect(new Set(v4Flagships.map(flagship => flagship.entryRoute)).size).toBe(7);
  });

  it("points every flagship at an existing indexed route and six-stage journey", () => {
    const routes = new Set(routeCatalog.routes.map(route => route.path));
    for (const flagship of v4Flagships) {
      expect(routes.has(flagship.entryRoute)).toBe(true);
      expect(getV4Journey(flagship.id).stages).toHaveLength(6);
      expect(flagship.worksNow.length).toBeGreaterThanOrEqual(3);
      expect(flagship.boundary.length).toBeGreaterThan(40);
      expect(flagship.sourceFile).toMatch(/^client\/src\/pages\/.+\.tsx$/);
      expect(flagship.releaseContract).toMatch(/^tests\/release\/.+\.test\.ts$/);
    }
  });

  it("keeps risky product claims explicitly bounded", () => {
    const web3 = v4Flagships.find(flagship => flagship.id === "web3")!;
    const commerce = v4Flagships.find(flagship => flagship.id === "commerce")!;
    const ai = v4Flagships.find(flagship => flagship.id === "ai")!;
    const live = v4Flagships.find(flagship => flagship.id === "live")!;

    expect(web3.boundary).toMatch(/No wallet connection/i);
    expect(web3.boundary).toMatch(/signing/i);
    expect(web3.boundary).toMatch(/custody/i);
    expect(commerce.boundary).toMatch(/No real sellers/i);
    expect(commerce.boundary).toMatch(/payment/i);
    expect(ai.boundary).toMatch(/No external model\/provider claim/i);
    expect(ai.boundary).toMatch(/autonomous execution/i);
    expect(live.boundary).toMatch(/small-room WebRTC/i);
    expect(live.boundary).toMatch(/no server ingest/i);
  });

  it("defines bounded cross-product missions", () => {
    expect(v4Missions.map(mission => mission.id)).toEqual([
      "connect",
      "learn",
      "play",
      "commerce",
      "verify",
    ]);
    for (const mission of v4Missions) {
      expect(mission.flagshipIds.length).toBeGreaterThan(0);
      expect(mission.description.length).toBeGreaterThan(50);
      for (const id of mission.flagshipIds) {
        expect(v4Flagships.some(flagship => flagship.id === id)).toBe(true);
      }
    }
  });
});

describe("V4 beta local test session", () => {
  it("normalizes corrupted state and removes unknown flagships", () => {
    expect(
      normalizeV4TestSession({
        missionId: "not-real",
        completedFlagships: ["gaming", "gaming", "fake", 4],
      })
    ).toEqual({
      missionId: "connect",
      completedFlagships: ["gaming"],
    });
  });

  it("switches missions without inventing completion", () => {
    const initial = normalizeV4TestSession({
      missionId: "connect",
      completedFlagships: ["social"],
    });
    expect(setV4Mission(initial, "verify")).toEqual({
      missionId: "verify",
      completedFlagships: ["social"],
    });
  });

  it("tracks tester-confirmed flagship passes and chooses the next mission step", () => {
    let session = normalizeV4TestSession({ missionId: "connect" });
    expect(getV4MissionProgress(session)).toEqual({
      completedCount: 0,
      totalCount: 2,
      percent: 0,
      nextFlagshipId: "social",
    });

    session = setV4FlagshipComplete(session, "social", true);
    expect(getV4MissionProgress(session)).toEqual({
      completedCount: 1,
      totalCount: 2,
      percent: 50,
      nextFlagshipId: "live",
    });

    session = setV4FlagshipComplete(session, "live", true);
    expect(getV4MissionProgress(session)).toEqual({
      completedCount: 2,
      totalCount: 2,
      percent: 100,
      nextFlagshipId: null,
    });
  });
});
