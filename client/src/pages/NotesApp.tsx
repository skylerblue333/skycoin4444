import { useEffect, useMemo, useState } from "react";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { searchText } from "@/lib/betaProductivity";
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
import { Textarea } from "@/components/ui/textarea";

type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
};

const STORAGE_KEY = "skycoin4444-beta-notes-v1";

function loadNotes(): Note[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Note =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.body === "string" &&
        typeof item?.updatedAt === "string"
    );
  } catch {
    return [];
  }
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => loadNotes()[0]?.id ?? null
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const filtered = useMemo(
    () =>
      notes
        .filter(note => searchText(query, [note.title, note.body]))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes, query]
  );
  const selected = notes.find(note => note.id === selectedId) ?? null;

  const createNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: "Untitled note",
      body: "",
      updatedAt: new Date().toISOString(),
    };
    setNotes(current => [note, ...current]);
    setSelectedId(note.id);
  };

  const updateSelected = (patch: Partial<Pick<Note, "title" | "body">>) => {
    if (!selectedId) return;
    setNotes(current =>
      current.map(note =>
        note.id === selectedId
          ? { ...note, ...patch, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setNotes(current => {
      const next = current.filter(note => note.id !== selectedId);
      setSelectedId(next[0]?.id ?? null);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline">Browser-local beta utility</Badge>
            <h1 className="mt-3 text-3xl font-bold">Notes</h1>
            <p className="mt-2 text-muted-foreground">
              Searchable notes saved only in this browser.
            </p>
          </div>
          <Button type="button" onClick={createNote}>
            <Plus className="mr-2 h-4 w-4" />
            New note
          </Button>
        </header>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Search notes"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {notes.length ? "No matching notes." : "Create your first note."}
                </p>
              ) : (
                filtered.map(note => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => setSelectedId(note.id)}
                    className={
                      "w-full rounded-lg border p-3 text-left " +
                      (note.id === selectedId
                        ? "border-primary bg-primary/5"
                        : "border-border")
                    }
                  >
                    <p className="truncate font-medium">{note.title || "Untitled"}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {note.body || "Empty note"}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            {selected ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <Button type="button" variant="ghost" onClick={deleteSelected}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                  <Input
                    value={selected.title}
                    maxLength={120}
                    onChange={event =>
                      updateSelected({ title: event.target.value })
                    }
                    aria-label="Note title"
                  />
                  <CardDescription>
                    Updated {new Date(selected.updatedAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selected.body}
                    onChange={event => updateSelected({ body: event.target.value })}
                    className="min-h-[360px]"
                    placeholder="Write your note…"
                  />
                </CardContent>
              </>
            ) : (
              <CardContent className="grid min-h-[420px] place-items-center text-sm text-muted-foreground">
                Select or create a note.
              </CardContent>
            )}
          </Card>
        </div>

        <p className="text-xs text-muted-foreground">
          No account sync, collaboration, cloud backup, or server persistence is
          provided by this beta utility.
        </p>
      </div>
    </main>
  );
}
