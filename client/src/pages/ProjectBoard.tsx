import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  matchesSearch,
  moveBoardItem,
  type BoardItem,
  type BoardStatus,
} from "@/lib/betaPlanning";

const STORAGE_KEY = "sky.project-board.v1";

const columns: Array<{ id: BoardStatus; label: string }> = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "In progress" },
  { id: "done", label: "Done" },
];

function loadItems(): BoardItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ProjectBoard() {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setItems(loadItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const visible = useMemo(
    () => items.filter(item => matchesSearch(search, [item.title, item.detail, item.status])),
    [items, search],
  );

  const addItem = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setItems(current => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: cleanTitle,
        detail: detail.trim(),
        status: "todo",
        createdAt: new Date().toISOString(),
      },
    ]);
    setTitle("");
    setDetail("");
  };

  const setStatus = (id: string, status: BoardStatus) => {
    setItems(current => moveBoardItem(current, id, status));
  };

  const removeItem = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <div>
          <Badge variant="outline">Browser-local beta utility</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Project Board</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A lightweight local Kanban board for planning work. It does not claim team assignment,
            cloud sync, notifications, approvals, or project-management integrations.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add task</CardTitle>
            <CardDescription>New tasks start in To do and are saved only in this browser.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
            <Input
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Task title"
              aria-label="Task title"
            />
            <Input
              value={detail}
              onChange={event => setDetail(event.target.value)}
              placeholder="Optional detail"
              aria-label="Task detail"
            />
            <Button onClick={addItem} disabled={!title.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </CardContent>
        </Card>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search board"
            className="pl-9"
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map(column => {
            const columnItems = visible.filter(item => item.status === column.id);
            return (
              <Card key={column.id} className="min-h-[360px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{column.label}</CardTitle>
                    <Badge variant="secondary">{columnItems.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {columnItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No tasks here.
                    </div>
                  ) : (
                    columnItems.map(item => (
                      <div key={item.id} className="rounded-xl border bg-card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold">{item.title}</div>
                            {item.detail ? (
                              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                                {item.detail}
                              </p>
                            ) : null}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            aria-label={"Delete " + item.title}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {columns
                            .filter(option => option.id !== item.status)
                            .map(option => (
                              <Button
                                key={option.id}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setStatus(item.id, option.id)}
                              >
                                <ArrowRight className="mr-1 h-3.5 w-3.5" />
                                {option.label}
                              </Button>
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
          No account sync, shared assignment, team presence, external ticketing integration, or server persistence.
        </div>
      </div>
    </main>
  );
}
