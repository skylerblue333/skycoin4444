import fs from "node:fs";
import { describe, expect, it } from "vitest";

const profile = fs.readFileSync("client/src/pages/Profile.tsx", "utf8");
const social = fs.readFileSync("client/src/pages/ActivityFeed.tsx", "utf8");
const school = fs.readFileSync("client/src/pages/CourseCatalog.tsx", "utf8");

describe("persisted activation surfaces", () => {
  it("routes profile access through canonical beta sign-in and validates usernames", () => {
    expect(profile).toMatch(/href="\/signin"/);
    expect(profile).not.toMatch(/startLogin/);
    expect(profile).toMatch(/USERNAME_PATTERN/);
    expect(profile).toMatch(/\^\[A-Za-z0-9_\.\-\]\+\$/);
    expect(profile).toMatch(/normalizedUsername\.length >= 2/);
    expect(profile).toMatch(/normalizedUsername\.length <= 64/);
    expect(profile).toMatch(/utils\.activation\.status\.invalidate/);
    expect(profile).toMatch(/not legal\s+identity verification/);
  });

  it("keeps social participation persisted and avoids identity-verification UI claims", () => {
    expect(social).toMatch(/href="\/signin"/);
    expect(social).not.toMatch(/startLogin/);
    expect(social).toMatch(/utils\.activation\.status\.invalidate/);
    expect(social).toMatch(/Persisted records only/);
    expect(social).toMatch(/does not invent audience size, engagement/);
    expect(social).not.toMatch(/post\.author\?\.verified/);
    expect(social).not.toMatch(/>\s*Verified\s*</);
    expect(social).toMatch(/not presented here as independent identity\s+verification/);
  });

  it("keeps SkySchool preview separate from durable account progress", () => {
    expect(school).toMatch(/href="\/signin"/);
    expect(school).not.toMatch(/startLogin/);
    expect(school).toMatch(/const activeCourseId = selected\?\.id \?\? ""/);
    expect(school).toMatch(/courseId: activeCourseId/);
    expect(school).toMatch(/utils\.activation\.status\.invalidate/);
    expect(school).toMatch(/Preview mode/);
    expect(school).toMatch(/durable progress requires an invited account/);
    expect(school).toMatch(/does not issue\s+certificates, financial advice, token rewards, or chain actions/);
    expect(school).not.toMatch(/verified progress/i);
  });
});
