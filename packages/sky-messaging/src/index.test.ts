import { describe, expect, it } from "vitest";
import { MessagingService, type MessagingNotificationContract } from "./index";

describe("SkyMessaging domain core", () => {
  it("creates a thread, sends idempotently, and emits notification metadata", () => {
    let now = 100;
    let messageSequence = 0;
    const events: MessagingNotificationContract[] = [];
    const service = new MessagingService({
      now: () => now,
      threadIdFactory: () => "thread_1",
      messageIdFactory: () => `msg_${++messageSequence}`,
      onNotification: event => events.push(event),
    });
    service.createThread(["user_b", "user_a"]);
    const first = service.send({
      threadId: "thread_1",
      senderId: "user_a",
      body: " Hello ",
      clientRequestId: "request_1",
    });
    now = 200;
    const retry = service.send({
      threadId: "thread_1",
      senderId: "user_a",
      body: "Hello",
      clientRequestId: "request_1",
    });

    expect(first.id).toBe(retry.id);
    expect(events).toHaveLength(1);
    expect(events[0].recipientIds).toEqual(["user_b"]);
  });

  it("enforces participant access and sender ownership", () => {
    const service = new MessagingService({
      threadIdFactory: () => "thread_2",
      messageIdFactory: () => "msg_1",
    });
    service.createThread(["user_a", "user_b"]);
    const message = service.send({
      threadId: "thread_2",
      senderId: "user_a",
      body: "hello",
      clientRequestId: "request_2",
    });

    expect(() => service.list("thread_2", "user_c")).toThrow(
      "thread_access_forbidden"
    );
    expect(() =>
      service.edit({
        messageId: message.id,
        actorId: "user_b",
        body: "nope",
      })
    ).toThrow("message_edit_forbidden");
    expect(() =>
      service.send({
        threadId: "thread_2",
        senderId: "user_c",
        body: "nope",
        clientRequestId: "request_3",
      })
    ).toThrow("sender_not_participant");
  });

  it("supports edit and delete without retaining deleted body content", () => {
    let now = 10;
    const service = new MessagingService({
      now: () => now,
      threadIdFactory: () => "thread_3",
      messageIdFactory: () => "msg_2",
    });
    service.createThread(["user_a", "user_b"]);
    const message = service.send({
      threadId: "thread_3",
      senderId: "user_a",
      body: "first",
      clientRequestId: "request_4",
    });
    now = 20;
    expect(
      service.edit({
        messageId: message.id,
        actorId: "user_a",
        body: "second",
      }).editedAt
    ).toBe(20);
    now = 30;
    const deleted = service.delete({
      messageId: message.id,
      actorId: "user_a",
    });
    expect(deleted.deletedAt).toBe(30);
    expect(deleted.body).toBe("");
  });

  it("validates participant and message inputs", () => {
    const service = new MessagingService({
      threadIdFactory: () => "thread_4",
    });
    expect(() => service.createThread(["user_a"])).toThrow(
      "invalid_participants"
    );
    service.createThread(["user_a", "user_b"]);
    expect(() =>
      service.send({
        threadId: "thread_4",
        senderId: "user_a",
        body: "   ",
        clientRequestId: "request_5",
      })
    ).toThrow("invalid_message_body");
  });

  it("rejects invalid and backwards clock values before persisting records", () => {
    let now = Number.NaN;
    const invalidClock = new MessagingService({
      now: () => now,
      threadIdFactory: () => "thread_bad_clock",
    });
    expect(() => invalidClock.createThread(["user_a", "user_b"])).toThrow(
      "invalid_clock"
    );
    expect(invalidClock.getThread("thread_bad_clock")).toBeUndefined();

    now = 20;
    const service = new MessagingService({
      now: () => now,
      threadIdFactory: () => "thread_clock",
      messageIdFactory: () => "msg_clock",
    });
    service.createThread(["user_a", "user_b"]);
    now = 19;
    expect(() =>
      service.send({
        threadId: "thread_clock",
        senderId: "user_a",
        body: "must not persist",
        clientRequestId: "request_clock",
      })
    ).toThrow("clock_moved_backwards");
    expect(service.list("thread_clock", "user_a")).toEqual([]);
  });

  it("uses code-unit ordering for equal-timestamp messages", () => {
    const ids = ["msg_a", "msg_Z"];
    let nextId = 0;
    const service = new MessagingService({
      now: () => 100,
      threadIdFactory: () => "thread_order",
      messageIdFactory: () => ids[nextId++],
    });
    service.createThread(["user_b", "user_a"]);
    service.send({
      threadId: "thread_order",
      senderId: "user_a",
      body: "first insertion",
      clientRequestId: "request_order_1",
    });
    service.send({
      threadId: "thread_order",
      senderId: "user_a",
      body: "second insertion",
      clientRequestId: "request_order_2",
    });

    expect(service.list("thread_order", "user_a").map(message => message.id)).toEqual([
      "msg_Z",
      "msg_a",
    ]);
  });
});
