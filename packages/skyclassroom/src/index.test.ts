import { describe, expect, it } from "vitest";
import {
  activateMembership,
  canManageMembership,
  inviteMember,
  removeMembership,
} from "./index";

describe("SkyClassroom membership core", () => {
  it("invites and activates a member", () => {
    const invited = inviteMember({
      classroomId: "class:1",
      userId: "student:1",
      role: "student",
    });
    expect(invited.state).toBe("invited");
    expect(activateMembership(invited).state).toBe("active");
  });

  it("allows only active instructors in the same classroom to manage another member", () => {
    const instructor = activateMembership(
      inviteMember({
        classroomId: "class:1",
        userId: "teacher:1",
        role: "instructor",
      })
    );
    const student = activateMembership(
      inviteMember({
        classroomId: "class:1",
        userId: "student:1",
        role: "student",
      })
    );
    expect(canManageMembership(instructor, student)).toBe(true);
    expect(canManageMembership(student, instructor)).toBe(false);
    expect(
      canManageMembership(instructor, { ...student, classroomId: "class:2" })
    ).toBe(false);
  });

  it("removes memberships and rejects repeated removal", () => {
    const removed = removeMembership(
      inviteMember({ classroomId: "c", userId: "u", role: "observer" })
    );
    expect(removed.state).toBe("removed");
    expect(() => removeMembership(removed)).toThrow();
  });

  it("rejects unsafe identifiers", () => {
    expect(() =>
      inviteMember({
        classroomId: "bad id",
        userId: "u",
        role: "student",
      })
    ).toThrow();
  });
});
