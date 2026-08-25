import { describe, expect, it } from "vitest";
import { SchedulerService } from "./index";

describe("SkyScheduler domain core", () => {
  it("plans and acknowledges one-time work deterministically", () => {
    const service = new SchedulerService();
    service.create({ id: "job_1", taskName: "send_digest", startAt: 1000 });

    expect(service.due(999)).toEqual([]);
    expect(service.due(1000)).toEqual([
      {
        contract: "skyscheduler.dispatch.v1",
        scheduleId: "job_1",
        taskName: "send_digest",
        dueAt: 1000,
      },
    ]);
    expect(
      service.acknowledge({ scheduleId: "job_1", dueAt: 1000 }).status
    ).toBe("completed");
    expect(service.due(2000)).toEqual([]);
  });

  it("advances recurring schedules only after matching acknowledgement", () => {
    const service = new SchedulerService();
    service.create({
      id: "job_2",
      taskName: "refresh_projection",
      startAt: 100,
      intervalMs: 50,
      maxRuns: 2,
    });

    expect(() =>
      service.acknowledge({ scheduleId: "job_2", dueAt: 101 })
    ).toThrow("stale_or_unknown_dispatch");
    service.acknowledge({ scheduleId: "job_2", dueAt: 100 });
    expect(service.nextDueAt("job_2")).toBe(150);
    expect(
      service.acknowledge({ scheduleId: "job_2", dueAt: 150 }).status
    ).toBe("completed");
  });

  it("pauses dispatch planning without discarding schedule state", () => {
    const service = new SchedulerService();
    service.create({
      id: "job_3",
      taskName: "cleanup_metadata",
      startAt: 10,
      intervalMs: 10,
    });
    service.pause("job_3");
    expect(service.due(100)).toEqual([]);
    service.resume("job_3");
    expect(service.due(100)[0].dueAt).toBe(10);
  });

  it("validates identifiers, timing bounds, and result limits", () => {
    const service = new SchedulerService();
    expect(() =>
      service.create({ id: "bad job", taskName: "task", startAt: 0 })
    ).toThrow("invalid_scheduleId");
    expect(() =>
      service.create({
        id: "job_4",
        taskName: "task",
        startAt: 0,
        intervalMs: 0,
      })
    ).toThrow("invalid_interval");
    expect(() => service.due(0, 0)).toThrow("invalid_due_limit");
  });
});
