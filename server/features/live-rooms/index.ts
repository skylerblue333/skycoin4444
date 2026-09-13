import { randomUUID } from "node:crypto";

export type LiveSignalKind = "ready" | "offer" | "answer" | "ice";
export type LiveParticipantRole = "host" | "viewer";

export interface LiveRoomSummary {
  id: string;
  title: string;
  category: string;
  status: "live" | "ended";
  viewerCount: number;
  createdAt: string;
}

export interface LiveParticipantSession {
  roomId: string;
  peerId: string;
  hostPeerId: string;
  role: LiveParticipantRole;
}

export interface LiveSignal {
  sequence: number;
  fromPeerId: string;
  toPeerId: string;
  kind: LiveSignalKind;
  payload: string;
  createdAt: string;
}

export interface LiveChatMessage {
  sequence: number;
  id: string;
  peerId: string;
  role: LiveParticipantRole;
  message: string;
  createdAt: string;
}

type Participant = {
  peerId: string;
  userId: string;
  role: LiveParticipantRole;
  lastSeenAt: number;
};

type Room = {
  id: string;
  hostUserId: string;
  hostPeerId: string;
  title: string;
  category: string;
  status: "live" | "ended";
  createdAt: number;
  endedAt: number | null;
  participants: Map<string, Participant>;
  signals: LiveSignal[];
  messages: LiveChatMessage[];
  nextSignalSequence: number;
  nextChatSequence: number;
};

const MAX_ACTIVE_ROOMS = 20;
const MAX_VIEWERS_PER_ROOM = 12;
const PARTICIPANT_TTL_MS = 45_000;
const SIGNAL_TTL_MS = 120_000;
const ENDED_ROOM_TTL_MS = 300_000;
const MAX_SIGNAL_BUFFER = 500;
const MAX_CHAT_MESSAGES = 100;

function cleanText(value: string, field: string, maxLength: number): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) throw new Error(`${field} is required`);
  if (normalized.length > maxLength) throw new Error(`${field} is too long`);
  return normalized;
}

function parseCreatedAt(value: string): number {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export class LiveRoomRegistry {
  private readonly rooms = new Map<string, Room>();

  constructor(private readonly now: () => number = () => Date.now()) {}

  private cleanup(): void {
    const now = this.now();
    for (const [roomId, room] of this.rooms) {
      if (room.endedAt !== null && now - room.endedAt > ENDED_ROOM_TTL_MS) {
        this.rooms.delete(roomId);
        continue;
      }

      if (room.status === "live") {
        for (const [peerId, participant] of room.participants) {
          if (participant.role === "viewer" && now - participant.lastSeenAt > PARTICIPANT_TTL_MS) {
            room.participants.delete(peerId);
          }
        }
      }

      room.signals = room.signals
        .filter(signal => now - parseCreatedAt(signal.createdAt) <= SIGNAL_TTL_MS)
        .slice(-MAX_SIGNAL_BUFFER);
      room.messages = room.messages.slice(-MAX_CHAT_MESSAGES);
    }
  }

  private requireRoom(roomId: string): Room {
    this.cleanup();
    const room = this.rooms.get(roomId);
    if (!room) throw new Error("live room not found");
    return room;
  }

  private requireLiveRoom(roomId: string): Room {
    const room = this.requireRoom(roomId);
    if (room.status !== "live") throw new Error("live room has ended");
    return room;
  }

  private requireParticipant(room: Room, userId: string, peerId: string): Participant {
    const participant = room.participants.get(peerId);
    if (!participant || participant.userId !== userId) throw new Error("live participant session not found");
    participant.lastSeenAt = this.now();
    return participant;
  }

  private summary(room: Room): LiveRoomSummary {
    const now = this.now();
    const viewerCount = [...room.participants.values()].filter(
      participant => participant.role === "viewer" && now - participant.lastSeenAt <= PARTICIPANT_TTL_MS,
    ).length;
    return {
      id: room.id,
      title: room.title,
      category: room.category,
      status: room.status,
      viewerCount,
      createdAt: new Date(room.createdAt).toISOString(),
    };
  }

  create(hostUserId: string, title: string, category: string): LiveParticipantSession & { room: LiveRoomSummary } {
    this.cleanup();
    const existing = [...this.rooms.values()].find(
      room => room.status === "live" && room.hostUserId === hostUserId,
    );
    if (existing) throw new Error("host already has an active live room");
    const activeCount = [...this.rooms.values()].filter(room => room.status === "live").length;
    if (activeCount >= MAX_ACTIVE_ROOMS) throw new Error("live room capacity reached");

    const id = randomUUID();
    const hostPeerId = randomUUID();
    const createdAt = this.now();
    const room: Room = {
      id,
      hostUserId,
      hostPeerId,
      title: cleanText(title, "title", 100),
      category: cleanText(category, "category", 40),
      status: "live",
      createdAt,
      endedAt: null,
      participants: new Map(),
      signals: [],
      messages: [],
      nextSignalSequence: 1,
      nextChatSequence: 1,
    };
    room.participants.set(hostPeerId, {
      peerId: hostPeerId,
      userId: hostUserId,
      role: "host",
      lastSeenAt: createdAt,
    });
    this.rooms.set(id, room);
    return { roomId: id, peerId: hostPeerId, hostPeerId, role: "host", room: this.summary(room) };
  }

  list(): LiveRoomSummary[] {
    this.cleanup();
    return [...this.rooms.values()]
      .filter(room => room.status === "live")
      .sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id))
      .map(room => this.summary(room));
  }

  get(roomId: string): LiveRoomSummary {
    return this.summary(this.requireRoom(roomId));
  }

  hostSession(roomId: string, userId: string): LiveParticipantSession {
    const room = this.requireLiveRoom(roomId);
    if (room.hostUserId !== userId) throw new Error("only the host can restore this live room");
    const participant = this.requireParticipant(room, userId, room.hostPeerId);
    return { roomId, peerId: participant.peerId, hostPeerId: room.hostPeerId, role: "host" };
  }

  join(roomId: string, userId: string): LiveParticipantSession {
    const room = this.requireLiveRoom(roomId);
    if (room.hostUserId === userId) return this.hostSession(roomId, userId);

    const existing = [...room.participants.values()].find(
      participant => participant.role === "viewer" && participant.userId === userId,
    );
    if (existing) {
      existing.lastSeenAt = this.now();
      return { roomId, peerId: existing.peerId, hostPeerId: room.hostPeerId, role: "viewer" };
    }

    const viewerCount = [...room.participants.values()].filter(participant => participant.role === "viewer").length;
    if (viewerCount >= MAX_VIEWERS_PER_ROOM) throw new Error("live room viewer capacity reached");
    const peerId = randomUUID();
    room.participants.set(peerId, {
      peerId,
      userId,
      role: "viewer",
      lastSeenAt: this.now(),
    });
    return { roomId, peerId, hostPeerId: room.hostPeerId, role: "viewer" };
  }

  heartbeat(roomId: string, userId: string, peerId: string): LiveRoomSummary {
    const room = this.requireLiveRoom(roomId);
    this.requireParticipant(room, userId, peerId);
    return this.summary(room);
  }

  end(roomId: string, userId: string): LiveRoomSummary {
    const room = this.requireRoom(roomId);
    if (room.hostUserId !== userId) throw new Error("only the host can end this live room");
    if (room.status === "live") {
      room.status = "ended";
      room.endedAt = this.now();
    }
    return this.summary(room);
  }

  sendSignal(
    roomId: string,
    userId: string,
    fromPeerId: string,
    toPeerId: string,
    kind: LiveSignalKind,
    payload: string,
  ): LiveSignal {
    const room = this.requireLiveRoom(roomId);
    this.requireParticipant(room, userId, fromPeerId);
    if (!room.participants.has(toPeerId)) throw new Error("signal target is not in this live room");
    if (fromPeerId === toPeerId) throw new Error("cannot signal the same peer");
    if (payload.length > 24_000) throw new Error("signal payload is too large");
    if (kind !== "ready" && !payload.trim()) throw new Error("signal payload is required");

    const signal: LiveSignal = {
      sequence: room.nextSignalSequence++,
      fromPeerId,
      toPeerId,
      kind,
      payload,
      createdAt: new Date(this.now()).toISOString(),
    };
    room.signals.push(signal);
    if (room.signals.length > MAX_SIGNAL_BUFFER) room.signals.splice(0, room.signals.length - MAX_SIGNAL_BUFFER);
    return signal;
  }

  pollSignals(roomId: string, userId: string, peerId: string, afterSequence: number): LiveSignal[] {
    const room = this.requireLiveRoom(roomId);
    this.requireParticipant(room, userId, peerId);
    return room.signals.filter(signal => signal.toPeerId === peerId && signal.sequence > afterSequence).slice(0, 100);
  }

  sendChat(roomId: string, userId: string, peerId: string, message: string): LiveChatMessage {
    const room = this.requireLiveRoom(roomId);
    const participant = this.requireParticipant(room, userId, peerId);
    const chat: LiveChatMessage = {
      sequence: room.nextChatSequence++,
      id: randomUUID(),
      peerId,
      role: participant.role,
      message: cleanText(message, "message", 500),
      createdAt: new Date(this.now()).toISOString(),
    };
    room.messages.push(chat);
    if (room.messages.length > MAX_CHAT_MESSAGES) room.messages.shift();
    return chat;
  }

  listChat(roomId: string, userId: string, peerId: string, afterSequence: number): LiveChatMessage[] {
    const room = this.requireLiveRoom(roomId);
    this.requireParticipant(room, userId, peerId);
    return room.messages.filter(message => message.sequence > afterSequence).slice(0, 100);
  }

  deleteChat(roomId: string, userId: string, messageId: string): boolean {
    const room = this.requireLiveRoom(roomId);
    if (room.hostUserId !== userId) throw new Error("only the host can moderate live chat");
    const index = room.messages.findIndex(message => message.id === messageId);
    if (index < 0) return false;
    room.messages.splice(index, 1);
    return true;
  }
}

export const liveRoomRegistry = new LiveRoomRegistry();
