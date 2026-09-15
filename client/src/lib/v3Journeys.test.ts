import { describe, expect, it } from "vitest";
import routeCatalog from "@/data/routeCatalog.json";
import {
  findJourneyForRoute,
  getNextV3JourneyStage,
  getV3JourneyCompletionPercent,
  normalizeJourneyRoute,
  normalizeV3JourneyProgress,
  setV3JourneyStageComplete,
  v3Journeys,
} from "./v3Journeys";

describe("V3 deep product journeys", () => {
  it("defines the seven headline product loops", () => {
    expect(v3Journeys.map(journey => journey.id)).toEqual([
      "social",
      "gaming",
      "live",
      "commerce",
      "learning",
      "ai",
      "web3",
    ]);
  });

  it("gives every journey enough depth and an explicit truth boundary", () => {
    for (const journey of v3Journeys) {
      expect(journey.stages.length).toBeGreaterThanOrEqual(6);
      expect(journey.outcome.length).toBeGreaterThan(60);
      expect(journey.boundary.length).toBeGreaterThan(60);
      expect(new Set(journey.stages.map(stage => stage.id)).size).toBe(
        journey.stages.length
      );
      for (const stage of journey.stages) {
        expect(stage.title.length).toBeGreaterThan(2);
        expect(stage.description.length).toBeGreaterThan(35);
        expect(stage.evidence.length).toBeGreaterThan(35);
        expect(stage.route).toMatch(/^\//);
      }
    }
  });

  it("only points journey stages at registered application routes", () => {
    const registered = new Set(routeCatalog.routes.map(route => route.path));
    for (const journey of v3Journeys) {
      for (const route of journey.entryRoutes) expect(registered.has(route)).toBe(true);
      for (const stage of journey.stages) expect(registered.has(stage.route)).toBe(true);
    }
  });

  it("matches only the intentional entry surfaces for journey context", () => {
    expect(findJourneyForRoute("/activity-feed")?.id).toBe("social");
    expect(findJourneyForRoute("/arcade?mode=favorites")?.id).toBe("gaming");
    expect(findJourneyForRoute("/live/")?.id).toBe("live");
    expect(findJourneyForRoute("/beta-commerce")?.id).toBe("commerce");
    expect(findJourneyForRoute("/course-catalog")?.id).toBe("learning");
    expect(findJourneyForRoute("/a-i-tools-hub")?.id).toBe("ai");
    expect(findJourneyForRoute("/beta-web3")?.id).toBe("web3");
    expect(findJourneyForRoute("/privacy-settings")).toBeUndefined();
    expect(normalizeJourneyRoute("/live/?room=123#chat")).toBe("/live");
  });

  it("normalizes local progress and rejects unknown stages", () => {
    const normalized = normalizeV3JourneyProgress({
      social: ["discover", "discover", "unknown", 42],
      gaming: "not-an-array",
      fake: ["anything"],
    });
    expect(normalized.social).toEqual(["discover"]);
    expect(normalized.gaming).toBeUndefined();
    expect((normalized as Record<string, unknown>).fake).toBeUndefined();
  });

  it("tracks completion and returns the next unfinished stage", () => {
    let progress = {};
    progress = setV3JourneyStageComplete(progress, "commerce", "browse", true);
    progress = setV3JourneyStageComplete(progress, "commerce", "search", true);
    expect(getV3JourneyCompletionPercent(progress, "commerce")).toBe(33);
    expect(getNextV3JourneyStage(progress, "commerce").id).toBe("cart");

    progress = setV3JourneyStageComplete(progress, "commerce", "browse", false);
    expect(getNextV3JourneyStage(progress, "commerce").id).toBe("browse");
  });
});
