import { describe, expect, it } from "vitest";
import {
  DEFAULT_HOPE_AGENT_ID,
  HOPE_AGENT_PROFILES,
  HOPE_AGENT_PROFILE_COUNT,
  getHopeAgentProfile,
} from "./hopeAIAgents";

describe("HopeAI specialized agent catalog", () => {
  it("ships more than 100 distinct specialist profiles", () => {
    expect(HOPE_AGENT_PROFILE_COUNT).toBeGreaterThanOrEqual(101);
    expect(new Set(HOPE_AGENT_PROFILES.map(profile => profile.id)).size).toBe(
      HOPE_AGENT_PROFILE_COUNT
    );
  });

  it("includes a lawyer specialist with explicit legal truth boundaries", () => {
    const lawyer = getHopeAgentProfile("lawyer");
    expect(lawyer.name).toBe("Lawyer");
    expect(lawyer.category).toBe("legal");
    expect(lawyer.systemPrompt).toMatch(/general legal information/i);
    expect(lawyer.systemPrompt).toMatch(/jurisdiction/i);
    expect(lawyer.systemPrompt).toMatch(/never invent statutes/i);
    expect(lawyer.systemPrompt).toMatch(/not a lawyer-client relationship/i);
  });

  it("keeps engineering and security specialists truth-bounded", () => {
    expect(getHopeAgentProfile("software-engineer").systemPrompt).toMatch(
      /Never claim code was executed/i
    );
    expect(getHopeAgentProfile("security-analyst").systemPrompt).toMatch(
      /Stay defensive/i
    );
  });

  it("fails closed on unknown profiles", () => {
    expect(() => getHopeAgentProfile("does-not-exist")).toThrow(
      "unknown HopeAI agent profile"
    );
  });

  it("keeps a stable default profile", () => {
    expect(getHopeAgentProfile(DEFAULT_HOPE_AGENT_ID).name).toBe(
      "General Assistant"
    );
  });
});
