export type LiveParticipantRole = "host" | "viewer";
export type LiveSignalKind = "ready" | "offer" | "answer" | "ice";

export type LiveRoomSummary = {
  id: string;
  title: string;
  category: string;
  status: "live" | "ended";
  viewerCount: number;
  createdAt: string;
};

export type LiveParticipantSession = {
  roomId: string;
  peerId: string;
  hostPeerId: string;
  role: LiveParticipantRole;
};

export type LiveSignal = {
  sequence: number;
  fromPeerId: string;
  toPeerId: string;
  kind: LiveSignalKind;
  payload: string;
  createdAt: string;
};

export type LiveChatMessage = {
  sequence: number;
  id: string;
  peerId: string;
  role: LiveParticipantRole;
  message: string;
  createdAt: string;
};

type ApiErrorBody = { error?: string };

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "same-origin",
  });
  const payload = await response.json().catch(() => ({})) as T & ApiErrorBody;
  if (!response.ok) throw new Error(payload.error || `Live room request failed (${response.status})`);
  return payload;
}

export const liveRoomsApi = {
  async list(): Promise<LiveRoomSummary[]> {
    const result = await requestJson<{ rooms: LiveRoomSummary[] }>("/api/live/rooms");
    return result.rooms;
  },

  async create(title: string, category: string): Promise<LiveParticipantSession & { room: LiveRoomSummary }> {
    return requestJson("/api/live/rooms", {
      method: "POST",
      body: JSON.stringify({ title, category }),
    });
  },

  async join(roomId: string): Promise<LiveParticipantSession> {
    return requestJson(`/api/live/rooms/${encodeURIComponent(roomId)}/join`, { method: "POST" });
  },

  async heartbeat(session: LiveParticipantSession): Promise<LiveRoomSummary> {
    const result = await requestJson<{ room: LiveRoomSummary }>(
      `/api/live/rooms/${encodeURIComponent(session.roomId)}/heartbeat`,
      { method: "POST", body: JSON.stringify({ peerId: session.peerId }) },
    );
    return result.room;
  },

  async end(roomId: string): Promise<LiveRoomSummary> {
    const result = await requestJson<{ room: LiveRoomSummary }>(
      `/api/live/rooms/${encodeURIComponent(roomId)}/end`,
      { method: "POST" },
    );
    return result.room;
  },

  async sendSignal(
    session: LiveParticipantSession,
    toPeerId: string,
    kind: LiveSignalKind,
    payload: string,
  ): Promise<LiveSignal> {
    const result = await requestJson<{ signal: LiveSignal }>(
      `/api/live/rooms/${encodeURIComponent(session.roomId)}/signals`,
      {
        method: "POST",
        body: JSON.stringify({
          fromPeerId: session.peerId,
          toPeerId,
          kind,
          payload,
        }),
      },
    );
    return result.signal;
  },

  async signals(session: LiveParticipantSession, afterSequence: number): Promise<LiveSignal[]> {
    const query = new URLSearchParams({ peerId: session.peerId, after: String(afterSequence) });
    const result = await requestJson<{ signals: LiveSignal[] }>(
      `/api/live/rooms/${encodeURIComponent(session.roomId)}/signals?${query}`,
    );
    return result.signals;
  },

  async sendChat(session: LiveParticipantSession, message: string): Promise<LiveChatMessage> {
    const result = await requestJson<{ message: LiveChatMessage }>(
      `/api/live/rooms/${encodeURIComponent(session.roomId)}/chat`,
      { method: "POST", body: JSON.stringify({ peerId: session.peerId, message }) },
    );
    return result.message;
  },

  async chat(session: LiveParticipantSession, afterSequence: number): Promise<LiveChatMessage[]> {
    const query = new URLSearchParams({ peerId: session.peerId, after: String(afterSequence) });
    const result = await requestJson<{ messages: LiveChatMessage[] }>(
      `/api/live/rooms/${encodeURIComponent(session.roomId)}/chat?${query}`,
    );
    return result.messages;
  },

  async deleteChat(roomId: string, messageId: string): Promise<boolean> {
    const result = await requestJson<{ deleted: boolean }>(
      `/api/live/rooms/${encodeURIComponent(roomId)}/chat/${encodeURIComponent(messageId)}`,
      { method: "DELETE" },
    );
    return result.deleted;
  },
};
