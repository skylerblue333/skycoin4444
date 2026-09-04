import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Task = {
  id: string;
  text: string;
  done: boolean;
  priority: "low" | "normal" | "high";
  createdAt: string;
};

const STORAGE_KEY = "skycoin4444-beta-todos-v1";

function loadTasks(): Task[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("normal");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const visible = useMemo(
    () =>
      tasks.filter(task =>
        filter === "all" ? true : filter === "done" ? task.done : !task.done
      ),
    [filter, tasks]
  );

  const addTask = (event: FormEvent) => {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setTasks(current => [
      {
        id: crypto.randomUUID(),
        text: clean,
        done: false,
        priority,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setText("");
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline">Browser-local beta utility</Badge>
          <h1 className="mt-3 text-3xl font-bold">Todo list</h1>
          <p className="mt-2 text-muted-foreground">
            Create, prioritize, complete, filter, and remove local tasks.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Add a task</CardTitle>
            <CardDescription>
              Tasks are stored only in this browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTask} className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={text}
                maxLength={160}
                onChange={event => setText(event.target.value)}
                placeholder="What needs doing?"
                className="flex-1"
              />
              <select
                value={priority}
                onChange={event =>
                  setPriority(event.target.value as Task["priority"])
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
              <Button type="submit" disabled={!text.trim()}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {(["all", "open", "done"] as const).map(value => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={filter === value ? "default" : "outline"}
              onClick={() => setFilter(value)}
            >
              {value}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-3 p-5">
            {visible.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No tasks in this view.
              </p>
            ) : (
              visible.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl border p-4"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setTasks(current =>
                        current.map(item =>
                          item.id === task.id
                            ? { ...item, done: !item.done }
                            : item
                        )
                      )
                    }
                    aria-label={task.done ? "Mark task open" : "Mark task done"}
                  >
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={task.done ? "line-through opacity-50" : ""}>
                      {task.text}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Priority: {task.priority}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setTasks(current =>
                        current.filter(item => item.id !== task.id)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          No reminders, shared assignment, server sync, or calendar integration
          is provided.
        </p>
      </div>
    </main>
  );
}
