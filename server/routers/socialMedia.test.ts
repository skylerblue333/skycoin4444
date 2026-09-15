import { describe, expect, it } from "vitest";
import { socialMediaUrlSchema } from "./social";

describe("social media URL policy", () => {
  it("accepts absent and HTTPS media references", () => {
    expect(socialMediaUrlSchema.parse(undefined)).toBeUndefined();
    expect(socialMediaUrlSchema.parse(null)).toBeNull();
    expect(socialMediaUrlSchema.parse("https://media.example/video.mp4")).toBe(
      "https://media.example/video.mp4"
    );
  });

  it("rejects insecure or executable schemes", () => {
    expect(() => socialMediaUrlSchema.parse("http://example.com/image.png")).toThrow(/HTTPS/);
    expect(() => socialMediaUrlSchema.parse("javascript:alert(1)")).toThrow();
  });
});
