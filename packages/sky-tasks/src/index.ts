export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type Task = Readonly<{ id: string; projectId: string; title: string; status: TaskStatus; version: number; assigneeId?: string }>;

export const TASK_CHANGED_EVENT = 'sky.task.changed.v1' as const;

const clean = (value: string, field: string) => {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
};

export function createTask(id: string, projectId: string, title: string): Task {
  return Object.freeze({ id: clean(id, 'id'), projectId: clean(projectId, 'projectId'), title: clean(title, 'title'), status: 'todo', version: 1 });
}

export function assignTask(task: Task, assigneeId: string): Task {
  if (task.status === 'done' || task.status === 'cancelled') throw new Error('terminal tasks cannot be assigned');
  return Object.freeze({ ...task, assigneeId: clean(assigneeId, 'assigneeId'), version: task.version + 1 });
}

export function startTask(task: Task): Task {
  if (task.status !== 'todo') throw new Error('only todo tasks can start');
  return Object.freeze({ ...task, status: 'in_progress', version: task.version + 1 });
}

export function completeTask(task: Task): Task {
  if (task.status !== 'in_progress') throw new Error('only in-progress tasks can complete');
  return Object.freeze({ ...task, status: 'done', version: task.version + 1 });
}

export function cancelTask(task: Task): Task {
  if (task.status === 'done') throw new Error('completed tasks cannot be cancelled');
  if (task.status === 'cancelled') return task;
  return Object.freeze({ ...task, status: 'cancelled', version: task.version + 1 });
}
