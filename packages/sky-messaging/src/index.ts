export interface ThreadRecord {
  id: string;
  participantIds: string[];
  createdAt: number;
}

export interface MessageRecord {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  clientRequestId: string;
  createdAt: number;
  editedAt: number | null;
  deletedAt: number | null;
}

export interface MessagingNotificationContract {
  type: "message.created";
  threadId: string;
  messageId: string;
  senderId: string;
  recipientIds: string[];
  occurredAt: number;
}

export interface MessagingServiceOptions {
  now?: () => number;
  threadIdFactory?: () => string;
  messageIdFactory?: () => string;
  onNotification?: (event: MessagingNotificationContract) => void;
}

const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_PARTICIPANTS = 50;
const MAX_BODY_LENGTH = 4000;

export class MessagingService {
  private readonly threads = new Map<string, ThreadRecord>();
  private readonly messages = new Map<string, MessageRecord>();
  private readonly requestIndex = new Map<string, string>();
  private readonly now: () => number;
  private readonly threadIdFactory: () => string;
  private readonly messageIdFactory: () => string;
  private readonly onNotification?: (
    event: MessagingNotificationContract
  ) => void;
  private lastTimestamp = -1;

  constructor(options: MessagingServiceOptions = {}) {
    this.now = options.now ?? Date.now;
    this.threadIdFactory =
      options.threadIdFactory ??
      (() => `thread_${Math.random().toString(36).slice(2, 18)}`);
    this.messageIdFactory =
      options.messageIdFactory ??
      (() => `msg_${Math.random().toString(36).slice(2, 18)}`);
    this.onNotification = options.onNotification;
  }

  createThread(participantIds: string[]): ThreadRecord {
    if (!Array.isArray(participantIds)) {
      throw new Error("invalid_participants");
    }
    const unique = [
      ...new Set(
        participantIds.map(id => validateIdentifier("participantId", id))
      ),
    ].sort(compareCodeUnits);
    if (unique.length < 2 || unique.length > MAX_PARTICIPANTS) {
      throw new Error("invalid_participants");
    }

    const id = validateIdentifier("threadId", this.threadIdFactory());
    if (this.threads.has(id)) throw new Error("thread_id_collision");
    const record: ThreadRecord = {
      id,
      participantIds: unique,
      createdAt: this.nextTimestamp(),
    };
    this.threads.set(id, cloneThread(record));
    return cloneThread(record);
  }

  getThread(threadId: string): ThreadRecord | undefined {
    const record = this.threads.get(validateIdentifier("threadId", threadId));
    return record ? cloneThread(record) : undefined;
  }

  send(input: {
    threadId: string;
    senderId: string;
    body: string;
    clientRequestId: string;
  }): MessageRecord {
    const thread = this.requireThread(input.threadId);
    const senderId = validateIdentifier("senderId", input.senderId);
    if (!thread.participantIds.includes(senderId)) {
      throw new Error("sender_not_participant");
    }
    const body = validateBody(input.body);
    const clientRequestId = validateIdentifier(
      "clientRequestId",
      input.clientRequestId
    );
    const requestKey = `${thread.id}:${senderId}:${clientRequestId}`;
    const existingId = this.requestIndex.get(requestKey);
    if (existingId) return cloneMessage(this.messages.get(existingId)!);

    const id = validateIdentifier("messageId", this.messageIdFactory());
    if (this.messages.has(id)) throw new Error("message_id_collision");
    const createdAt = this.nextTimestamp();
    const record: MessageRecord = {
      id,
      threadId: thread.id,
      senderId,
      body,
      clientRequestId,
      createdAt,
      editedAt: null,
      deletedAt: null,
    };
    this.messages.set(id, cloneMessage(record));
    this.requestIndex.set(requestKey, id);
    this.onNotification?.({
      type: "message.created",
      threadId: thread.id,
      messageId: id,
      senderId,
      recipientIds: thread.participantIds.filter(
        idValue => idValue !== senderId
      ),
      occurredAt: createdAt,
    });
    return cloneMessage(record);
  }

  edit(input: {
    messageId: string;
    actorId: string;
    body: string;
  }): MessageRecord {
    const record = this.requireMessage(input.messageId);
    const actorId = validateIdentifier("actorId", input.actorId);
    if (record.senderId !== actorId) {
      throw new Error("message_edit_forbidden");
    }
    if (record.deletedAt !== null) throw new Error("message_deleted");
    const next = {
      ...record,
      body: validateBody(input.body),
      editedAt: this.nextTimestamp(),
    };
    this.messages.set(next.id, cloneMessage(next));
    return cloneMessage(next);
  }

  delete(input: { messageId: string; actorId: string }): MessageRecord {
    const record = this.requireMessage(input.messageId);
    const actorId = validateIdentifier("actorId", input.actorId);
    if (record.senderId !== actorId) {
      throw new Error("message_delete_forbidden");
    }
    if (record.deletedAt !== null) return record;
    const next = { ...record, body: "", deletedAt: this.nextTimestamp() };
    this.messages.set(next.id, cloneMessage(next));
    return cloneMessage(next);
  }

  list(threadId: string, actorId: string): MessageRecord[] {
    const thread = this.requireThread(threadId);
    const actor = validateIdentifier("actorId", actorId);
    if (!thread.participantIds.includes(actor)) {
      throw new Error("thread_access_forbidden");
    }
    return [...this.messages.values()]
      .filter(message => message.threadId === thread.id)
      .sort((a, b) => a.createdAt - b.createdAt || compareCodeUnits(a.id, b.id))
      .map(cloneMessage);
  }

  private nextTimestamp(): number {
    const value = this.now();
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error("invalid_clock");
    }
    if (value < this.lastTimestamp) {
      throw new Error("clock_moved_backwards");
    }
    this.lastTimestamp = value;
    return value;
  }

  private requireThread(threadId: string): ThreadRecord {
    const record = this.getThread(threadId);
    if (!record) throw new Error("thread_not_found");
    return record;
  }

  private requireMessage(messageId: string): MessageRecord {
    const record = this.messages.get(
      validateIdentifier("messageId", messageId)
    );
    if (!record) throw new Error("message_not_found");
    return cloneMessage(record);
  }
}

function validateIdentifier(name: string, value: string): string {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) {
    throw new Error(`invalid_${name}`);
  }
  return value;
}

function validateBody(value: string): string {
  if (typeof value !== "string") throw new Error("invalid_message_body");
  const body = value.trim();
  if (!body || body.length > MAX_BODY_LENGTH || /\u0000/.test(body)) {
    throw new Error("invalid_message_body");
  }
  return body;
}

function compareCodeUnits(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function cloneThread(record: ThreadRecord): ThreadRecord {
  return { ...record, participantIds: [...record.participantIds] };
}

function cloneMessage(record: MessageRecord): MessageRecord {
  return { ...record };
}
