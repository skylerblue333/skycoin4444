import { describe, expect, it } from "vitest";
import { transitionIncident } from "./index";

const incident = { id: "inc:1", state: "open" as const, severity: 1 as const };

describe("SkyIncident", () => {
  it("supports the mitigation and resolution lifecycle", () => {
    const mitigating = transitionIncident(incident, "mitigating");
    const resolved = transitionIncident(mitigating, "resolved");
    expect(transitionIncident(resolved, "closed").state).toBe("closed");
  });

  it("supports reopening a resolved incident", () => {
    expect(transitionIncident({ ...incident, state: "resolved" }, "open").state).toBe("open");
  });

  it("rejects invalid transitions", () => {
    expect(() => transitionIncident(incident, "closed")).toThrow("invalid transition");
  });
});
