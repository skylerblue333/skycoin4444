import { describe, expect, it } from 'vitest';
import { assignTask, cancelTask, completeTask, createTask, startTask } from './index';

describe('SkyTasks', () => {
  it('creates normalized todo tasks', () => {
    expect(createTask(' t1 ', ' p1 ', ' Ship docs ')).toEqual({ id: 't1', projectId: 'p1', title: 'Ship docs', status: 'todo', version: 1 });
  });

  it('supports assignment and deterministic lifecycle transitions', () => {
    const assigned = assignTask(createTask('t1', 'p1', 'Ship docs'), ' u1 ');
    expect(assigned.assigneeId).toBe('u1');
    const started = startTask(assigned);
    const done = completeTask(started);
    expect(done.status).toBe('done');
    expect(done.version).toBe(4);
  });

  it('rejects invalid transitions and terminal mutation', () => {
    const task = createTask('t1', 'p1', 'Ship docs');
    expect(() => completeTask(task)).toThrow('only in-progress tasks can complete');
    const done = completeTask(startTask(task));
    expect(() => assignTask(done, 'u1')).toThrow('terminal tasks cannot be assigned');
    expect(() => cancelTask(done)).toThrow('completed tasks cannot be cancelled');
  });

  it('cancels idempotently', () => {
    const cancelled = cancelTask(createTask('t1', 'p1', 'Ship docs'));
    expect(cancelTask(cancelled)).toBe(cancelled);
  });
});
