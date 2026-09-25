import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("client/src/index.css", "utf8");

describe("global interaction accessibility baseline", () => {
  it("honors the operating-system reduced-motion preference across the app", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation-duration: 0.01ms !important");
    expect(css).toContain("animation-iteration-count: 1 !important");
    expect(css).toContain("transition-duration: 0.01ms !important");
    expect(css).toContain("scroll-behavior: auto !important");
  });

  it("keeps keyboard focus visible on the main interactive element families", () => {
    expect(css).toContain('a[href]');
    expect(css).toContain("button:not(:disabled)");
    expect(css).toContain("input:not(:disabled)");
    expect(css).toContain("select:not(:disabled)");
    expect(css).toContain("textarea:not(:disabled)");
    expect(css).toContain('[tabindex]:not([tabindex=\"-1\"])');
    expect(css).toContain("outline-offset: 3px");
  });

  it("preserves a focus indicator in forced-colors mode", () => {
    expect(css).toContain("@media (forced-colors: active)");
    expect(css).toContain("outline: 2px solid Highlight !important");
  });
});
