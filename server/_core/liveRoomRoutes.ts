import type { Express, Request, Response } from "express";
import { z } from "zod";
import { liveRoomRegistry } from "../features/live-rooms";
import { sdk } from "./sdk";

const uuid = z.string().uuid();
const signalBody = z.object({
  fromPeerId: uuid,
  toPeerId: uuid,
  kind: z.enum(["ready", "offer", "answer", "ice"]),
  payload: z.string().max(24_000),
});

function registryStatus(message: string): number {
  if (message.includes("not found")) return 404;
  if (message.startsWith("only the host") || message.includes("participant session")) return 403;
  if (message.includes("capacity") || message.includes("already has") || message.includes("has ended")) return 409;
  return 400;
}

function sendError(res: Response, error: unknown): void {
  const message = error instanceof Error ? error.message : "Live room operation failed";
  res.status(registryStatus(message)).json({ error: message });
}

async function authenticatedUserId(req: Request, res: Response): Promise<string | null> {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      res.status(401).json({ error: "Sign in is required for live room participation" });
      return null;
    }
    return user.id;
  } catch {
    res.status(401).json({ error: "Sign in is required for live room participation" });
    return null;
  }
}

function parseAfter(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : 0;
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
}

export function registerLiveRoomRoutes(app: Express): void {
  app.get("/api/live/rooms", (_req, res) => {
    res.json({ rooms: liveRoomRegistry.list() });
  });

  app.get("/api/live/rooms/:roomId", (req, res) => {
    try {
      const roomId = uuid.parse(req.params.roomId);
      res.json({ room: liveRoomRegistry.get(roomId) });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/live/rooms", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      const input = z.object({
        title: z.string().trim().min(1).max(100),
        category: z.string().trim().min(1).max(40),
      }).parse(req.body);
      res.status(201).json(liveRoomRegistry.create(userId, input.title, input.category));
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/live/rooms/:roomId/host-session", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      res.json(liveRoomRegistry.hostSession(uuid.parse(req.params.roomId), userId));
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/live/rooms/:roomId/join", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      res.json(liveRoomRegistry.join(uuid.parse(req.params.roomId), userId));
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/live/rooms/:roomId/heartbeat", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      const peerId = uuid.parse(req.body?.peerId);
      res.json({ room: liveRoomRegistry.heartbeat(uuid.parse(req.params.roomId), userId, peerId) });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/live/rooms/:roomId/end", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      res.json({ room: liveRoomRegistry.end(uuid.parse(req.params.roomId), userId) });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/live/rooms/:roomId/signals", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      const roomId = uuid.parse(req.params.roomId);
      const input = signalBody.parse(req.body);
      res.status(201).json({ signal: liveRoomRegistry.sendSignal(
        roomId,
        userId,
        input.fromPeerId,
        input.toPeerId,
        input.kind,
        input.payload,
      ) });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get("/api/live/rooms/:roomId/signals", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      const roomId = uuid.parse(req.params.roomId);
      const peerId = uuid.parse(req.query.peerId);
      res.json({ signals: liveRoomRegistry.pollSignals(roomId, userId, peerId, parseAfter(req.query.after)) });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/live/rooms/:roomId/chat", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      const roomId = uuid.parse(req.params.roomId);
      const input = z.object({ peerId: uuid, message: z.string().trim().min(1).max(500) }).parse(req.body);
      res.status(201).json({ message: liveRoomRegistry.sendChat(roomId, userId, input.peerId, input.message) });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get("/api/live/rooms/:roomId/chat", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      const roomId = uuid.parse(req.params.roomId);
      const peerId = uuid.parse(req.query.peerId);
      res.json({ messages: liveRoomRegistry.listChat(roomId, userId, peerId, parseAfter(req.query.after)) });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete("/api/live/rooms/:roomId/chat/:messageId", async (req, res) => {
    const userId = await authenticatedUserId(req, res);
    if (!userId) return;
    try {
      const deleted = liveRoomRegistry.deleteChat(
        uuid.parse(req.params.roomId),
        userId,
        uuid.parse(req.params.messageId),
      );
      res.json({ deleted });
    } catch (error) {
      sendError(res, error);
    }
  });
}
