import { describe, expect, it } from "vitest";
import { LiveRoomRegistry } from "./index";

describe("LiveRoomRegistry", () => {
  it("creates a bounded room, joins a viewer, and reports active presence", () => {
    let now = Date.parse("2026-09-12T20:00:00.000Z");
    const registry = new LiveRoomRegistry(() => now);
    const host = registry.create("host-user", "Build night", "Technology");
    const viewer = registry.join(host.roomId, "viewer-user");

    expect(host.role).toBe("host");
    expect(viewer.role).toBe("viewer");
    expect(viewer.hostPeerId).toBe(host.peerId);
    expect(registry.get(host.roomId).viewerCount).toBe(1);

    now += 46_000;
    expect(registry.get(host.roomId).viewerCount).toBe(0);
  });

  it("lets the creator restore a room before host expiry and refreshes its lease", () => {
    let now = Date.parse("2026-09-12T20:00:00.000Z");
    const registry = new LiveRoomRegistry(() => now);
    const host = registry.create("host-user", "Build night", "Technology");

    now += 60_000;
    expect(registry.hostSession(host.roomId, "host-user")).toMatchObject({
      roomId: host.roomId,
      peerId: host.peerId,
      role: "host",
    });

    now += 60_000;
    expect(registry.list()).toHaveLength(1);
    expect(registry.get(host.roomId).status).toBe("live");
  });

  it("expires an abandoned creator room instead of advertising a stale broadcast", () => {
    let now = Date.parse("2026-09-12T20:00:00.000Z");
    const registry = new LiveRoomRegistry(() => now);
    const host = registry.create("host-user", "Build night", "Technology");
    registry.join(host.roomId, "viewer-user");

    now += 91_000;
    expect(registry.list()).toEqual([]);
    expect(registry.get(host.roomId)).toMatchObject({
      status: "ended",
      viewerCount: 0,
    });
    expect(() => registry.join(host.roomId, "late-viewer")).toThrow("has ended");
  });

  it("routes signaling only to the intended authenticated peer", () => {
    const registry = new LiveRoomRegistry(() => Date.parse("2026-09-12T20:00:00.000Z"));
    const host = registry.create("host-user", "Build night", "Technology");
    const viewer = registry.join(host.roomId, "viewer-user");

    registry.sendSignal(host.roomId, "viewer-user", viewer.peerId, host.peerId, "ready", "");
    const hostSignals = registry.pollSignals(host.roomId, "host-user", host.peerId, 0);
    expect(hostSignals).toHaveLength(1);
    expect(hostSignals[0]).toMatchObject({
      fromPeerId: viewer.peerId,
      toPeerId: host.peerId,
      kind: "ready",
    });
    expect(registry.pollSignals(host.roomId, "host-user", host.peerId, hostSignals[0]!.sequence)).toEqual([]);
    expect(() => registry.pollSignals(host.roomId, "other-user", host.peerId, 0)).toThrow("participant session not found");
  });

  it("keeps chat bounded to room participants and lets only the host moderate", () => {
    const registry = new LiveRoomRegistry(() => Date.parse("2026-09-12T20:00:00.000Z"));
    const host = registry.create("host-user", "Build night", "Technology");
    const viewer = registry.join(host.roomId, "viewer-user");
    const message = registry.sendChat(host.roomId, "viewer-user", viewer.peerId, "  hello   live room  ");

    expect(message.message).toBe("hello live room");
    expect(registry.listChat(host.roomId, "host-user", host.peerId, 0)[0]).toMatchObject({
      id: message.id,
      role: "viewer",
    });
    expect(() => registry.deleteChat(host.roomId, "viewer-user", message.id)).toThrow("only the host");
    expect(registry.deleteChat(host.roomId, "host-user", message.id)).toBe(true);
    expect(registry.listChat(host.roomId, "host-user", host.peerId, 0)).toEqual([]);
  });

  it("caps small-room viewer fanout instead of pretending to be scalable infrastructure", () => {
    const registry = new LiveRoomRegistry(() => Date.parse("2026-09-12T20:00:00.000Z"));
    const host = registry.create("host-user", "Build night", "Technology");
    for (let index = 0; index < 12; index += 1) {
      registry.join(host.roomId, `viewer-${index}`);
    }
    expect(registry.get(host.roomId).viewerCount).toBe(12);
    expect(() => registry.join(host.roomId, "viewer-over-capacity")).toThrow("viewer capacity reached");
  });

  it("prevents non-host users from restoring or ending a creator room", () => {
    const registry = new LiveRoomRegistry(() => Date.parse("2026-09-12T20:00:00.000Z"));
    const host = registry.create("host-user", "Build night", "Technology");
    registry.join(host.roomId, "viewer-user");

    expect(() => registry.hostSession(host.roomId, "viewer-user")).toThrow("only the host");
    expect(() => registry.end(host.roomId, "viewer-user")).toThrow("only the host");
    expect(registry.end(host.roomId, "host-user").status).toBe("ended");
    expect(() => registry.join(host.roomId, "late-viewer")).toThrow("has ended");
  });
});
