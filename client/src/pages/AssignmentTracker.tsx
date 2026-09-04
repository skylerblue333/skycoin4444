import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Circle, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  matchesSearch,
  sortAssignments,
  type AssignmentItem,
  type AssignmentPriority,
} from "@/lib/betaPlanning";

const STORAGE_KEY = "sky.assignment-tracker.v1";

function loadAssignments(): AssignmentItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AssignmentTracker() {
  const [items, setItems] = useState<AssignmentItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<AssignmentPriority>("medium");
  const [search, setSearch] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    setItems(loadAssignments());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const visibleItems = useMemo(
    () =>
      sortAssignments(items).filter(
        item =>
          (showCompleted || !item.completed) &&
          matchesSearch(search, [item.title, item.course, item.dueDate, item.priority]),
      ),
    [items, search, showCompleted],
  );

  const addAssignment = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle || !dueDate) return;

    setItems(current => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: cleanTitle,
        course: course.trim(),
        dueDate,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setTitle("");
    setCourse("");
    setDueDate("");
    setPriority("medium");
  };

  const toggleComplete = (id: string) => {
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const removeAssignment = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <div>
          <Badge variant="outline">Browser-local beta utility</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Assignment Tracker</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Track coursework, due dates, priorities, and completion without creating fake grades,
            certificates, or instructor records.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add assignment</CardTitle>
            <CardDescription>
              Saved only in this browser. No school system, reminders, shared assignment, or server sync.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1.4fr_1fr_0.8fr_0.7fr_auto]">
            <Input
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Assignment title"
              aria-label="Assignment title"
            />
            <Input
              value={course}
              onChange={event => setCourse(event.target.value)}
              placeholder="Course or subject"
              aria-label="Course or subject"
            />
            <Input
              type="date"
              value={dueDate}
              onChange={event => setDueDate(event.target.value)}
              aria-label="Due date"
            />
            <select
              value={priority}
              onChange={event => setPriority(event.target.value as AssignmentPriority)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Priority"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button onClick={addAssignment} disabled={!title.trim() || !dueDate}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-4">
            <div>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>{items.length} saved in this browser</CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search title, course, date, or priority"
                  className="pl-9"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={event => setShowCompleted(event.target.checked)}
                />
                Show completed
              </label>
            </div>
          </CardHeader>
          <CardContent>
            {visibleItems.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                No assignments match this view.
              </div>
            ) : (
              <div className="space-y-3">
                {visibleItems.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                  >
                    <button
                      type="button"
                      onClick={() => toggleComplete(item.id)}
                      className="self-start text-muted-foreground hover:text-foreground sm:self-auto"
                      aria-label={item.completed ? "Mark assignment incomplete" : "Mark assignment complete"}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className={item.completed ? "font-semibold line-through opacity-60" : "font-semibold"}>
                        {item.title}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {item.course ? <span>{item.course}</span> : null}
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {item.dueDate}
                        </span>
                        <Badge variant="secondary">{item.priority}</Badge>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAssignment(item.id)}
                      aria-label={"Delete " + item.title}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
