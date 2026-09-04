import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("canonical HTML provider boundary", () => {
  it("does not load an unverified analytics provider by default", async () => {
    const html = await readFile(
      path.resolve(process.cwd(), "client", "index.html"),
      "utf8"
    );

    expect(html).not.toContain("VITE_ANALYTICS_ENDPOINT");
    expect(html).not.toContain("VITE_ANALYTICS_WEBSITE_ID");
    expect(html.toLowerCase()).not.toContain("/umami");
  });
});
