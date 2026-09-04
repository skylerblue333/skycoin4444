export type AssignmentPriority = "low" | "medium" | "high";
export type BoardStatus = "todo" | "doing" | "done";

export interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: AssignmentPriority;
  completed: boolean;
  createdAt: string;
}

export interface BoardItem {
  id: string;
  title: string;
  detail: string;
  status: BoardStatus;
  createdAt: string;
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesSearch(query: string, values: readonly string[]): boolean {
  const needle = normalizeSearch(query);
  if (!needle) return true;
  return values.some(value => value.toLowerCase().includes(needle));
}

export function sortAssignments(items: readonly AssignmentItem[]): AssignmentItem[] {
  const priorityRank: Record<AssignmentPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...items].sort((left, right) => {
    if (left.completed !== right.completed) return Number(left.completed) - Number(right.completed);
    if (left.dueDate !== right.dueDate) return left.dueDate.localeCompare(right.dueDate);
    if (left.priority !== right.priority) {
      return priorityRank[left.priority] - priorityRank[right.priority];
    }
    return left.createdAt.localeCompare(right.createdAt);
  });
}

export function moveBoardItem(
  items: readonly BoardItem[],
  id: string,
  status: BoardStatus,
): BoardItem[] {
  return items.map(item => (item.id === id ? { ...item, status } : item));
}

export function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function toLocalDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(year, month - 1, day);
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
}
