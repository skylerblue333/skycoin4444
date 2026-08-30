import { describe, expect, it } from "vitest";
import { addMember, createTeam, removeMember } from "./index";

describe("SkyTeams", () => {
  it("creates teams and manages deterministic membership", () => {
    let team = createTeam("t1", " Core Team ", "u1");
    team = addMember(team, { userId: "u3", role: "member" });
    team = addMember(team, { userId: "u2", role: "admin" });
    expect(team.members.map(m=>m.userId)).toEqual(["u1","u2","u3"]);
    team = removeMember(team,"u3");
    expect(team.members).toHaveLength(2);
  });
  it("rejects duplicate members and removing the last owner", () => {
    const team = createTeam("t1","Team","u1");
    expect(()=>addMember(team,{userId:"u1",role:"member"})).toThrow("already exists");
    expect(()=>removeMember(team,"u1")).toThrow("retain an owner");
  });
});
