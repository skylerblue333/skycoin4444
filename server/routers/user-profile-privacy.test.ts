import { describe, expect, it } from "vitest";
import { publicProfile } from "./user";

const privateUser = {
  id: "user:private",
  openId: "open:private",
  email: "private@example.test",
  username: "private-user",
  name: "Private User",
  bio: "private bio",
  avatar: "private-avatar",
  profileVisibility: "private",
  balance: 0,
  role: "user",
  verified: false,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
} as const;

describe("profile privacy projection", () => {
  it("redacts private profile content for non-owners", () => {
    const profile = publicProfile(privateUser, 3, "user:other");
    expect(profile).toMatchObject({
      id: "user:private",
      username: null,
      name: null,
      bio: null,
      avatar: null,
      email: null,
      followerCount: 0,
      profileVisibility: "private",
    });
  });

  it("returns the private profile to its owner", () => {
    const profile = publicProfile(privateUser, 3, "user:private");
    expect(profile).toMatchObject({
      username: "private-user",
      name: "Private User",
      bio: "private bio",
      email: "private@example.test",
      followerCount: 3,
      profileVisibility: "private",
    });
  });
});
