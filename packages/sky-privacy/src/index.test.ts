import { describe, expect, it } from "vitest";
import { createExportManifest, createPrivacyRequest, toPrivacyIntegrationEvent, transitionPrivacyRequest } from "./index";

describe("SkyPrivacy", () => {
  it("normalizes export categories deterministically", () => {
    expect(createExportManifest("user:123", ["Profile", "messages", "profile"], "2026-08-25T09:00:00Z")).toEqual({
      subjectId: "user:123",
      categories: ["messages", "profile"],
      requestedAt: "2026-08-25T09:00:00.000Z",
      format: "json",
    });
  });

  it("validates identifiers, categories, and runtime actions", () => {
    expect(() => createExportManifest("x", ["profile"], "2026-08-25T09:00:00Z")).toThrow();
    expect(() => createExportManifest("user:123", ["../secret"], "2026-08-25T09:00:00Z")).toThrow();
    expect(() =>
      createPrivacyRequest({
        id: "privacy_003",
        subjectId: "user:789",
        action: "archive" as never,
        requestedAt: "2026-08-25T11:00:00Z",
      }),
    ).toThrow("action must be export or delete");
  });

  it("enforces delete/export workflow transitions", () => {
    const request = createPrivacyRequest({ id: "privacy_001", subjectId: "user:123", action: "delete", requestedAt: "2026-08-25T09:00:00Z" });
    const approved = transitionPrivacyRequest(request, "approved");
    const completed = transitionPrivacyRequest(approved, "completed");
    expect(completed.status).toBe("completed");
    expect(() => transitionPrivacyRequest(request, "completed")).toThrow();
  });

  it("derives integration event type from lifecycle status", () => {
    const request = createPrivacyRequest({ id: "privacy_002", subjectId: "user:456", action: "export", requestedAt: "2026-08-25T10:00:00Z" });
    expect(toPrivacyIntegrationEvent(request)).toEqual({ type: "privacy.requested", subjectId: "user:456", requestId: "privacy_002", status: "requested" });

    const approved = transitionPrivacyRequest(request, "approved");
    expect(toPrivacyIntegrationEvent(approved)).toEqual({
      type: "privacy.status_changed",
      subjectId: "user:456",
      requestId: "privacy_002",
      status: "approved",
    });
  });
});
