import fs from "node:fs";
import { describe, expect, it } from "vitest";

const app = fs.readFileSync("client/src/App.tsx", "utf8");
const boundary = fs.readFileSync("client/src/components/ErrorBoundary.tsx", "utf8");
const notFound = fs.readFileSync("client/src/pages/NotFound.tsx", "utf8");

describe("screen recovery and area restoration", () => {
  it("keeps canonical Gaming and Learn routes registered", () => {
    expect(app).toMatch(/path="\/arcade" component=\{Arcade\}/);
    expect(app).toMatch(/path="\/gaming" component=\{Gaming\}/);
    expect(app).toMatch(/path="\/course-catalog" component=\{CourseCatalog\}/);
    expect(app).toMatch(/path="\/sky-school" component=\{SkySchool\}/);
  });

  it("provides layered lazy-screen and render-error recovery", () => {
    expect(app).toMatch(/ScreenLoadingFallback/);
    expect(boundary).toMatch(/Try again/);
    expect(boundary).toMatch(/Reload app/);
    expect(boundary).toMatch(/No progress, wallet data, or account records are deleted/);
  });

  it("offers core-area recovery when a route is missing", () => {
    expect(notFound).toMatch(/Route recovery/);
    expect(notFound).toMatch(/Recover the Arcade and game paths/);
    expect(notFound).toMatch(/Recover courses and lesson progress/);
    expect(notFound).toMatch(/Search all areas/);
  });
});
