import fs from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = fs.readFileSync(
  "client/src/pages/DatingProfileSetup.tsx",
  "utf8"
);

describe("dating profile setup", () => {
  it("contains deterministic validation rules", () => {
    expect(pageSource).toMatch(/Display name must be at least 2 characters/);
    expect(pageSource).toMatch(/Age must be between 18 and 120/);
    expect(pageSource).toMatch(/Bio must be at least 10 characters/);
    expect(pageSource).toMatch(/Choose at least one interest/);
    expect(pageSource).toMatch(/Choose no more than 8 interests/);
  });

  it("keeps a session draft while persisting supported fields when authenticated", () => {
    expect(pageSource).toMatch(/sessionStorage\.setItem/);
    expect(pageSource).toMatch(/trpc\.dating\.upsertProfile/);
    expect(pageSource).toMatch(/Photos, display[\s\S]*remain[\s\S]*browser-session data/);
    expect(pageSource).toMatch(
      /do not perform[\s\S]*email, phone, or government-ID verification/
    );
  });
});
