import { describe, expect, it } from "vitest";
import { addMember, createGroup, removeMember } from "./index";

describe("SkyGroups", () => {
  const group = createGroup({ id: "g1", name: "Builders", ownerId: "u1", now: "2026-08-25T12:00:00Z" });
  it("creates a private group with an owner", () => { expect(group.visibility).toBe("private"); expect(group.members[0].role).toBe("owner"); });
  it("adds and removes members with role checks", () => {
    const withMember = addMember(group, { userId: "u2", role: "member", joinedAt: "2026-08-25T12:01:00Z" }, "u1");
    expect(withMember.members).toHaveLength(2);
    expect(removeMember(withMember, "u2", "u1").members).toHaveLength(1);
  });
  it("blocks unauthorized membership changes", () => {
    const withMember = addMember(group, { userId: "u2", role: "member", joinedAt: "2026-08-25T12:01:00Z" }, "u1");
    expect(() => addMember(withMember, { userId: "u3", role: "member", joinedAt: "2026-08-25T12:02:00Z" }, "u2")).toThrow("not allowed");
  });
});
