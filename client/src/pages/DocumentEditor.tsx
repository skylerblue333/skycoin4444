import { useEffect, useState } from "react";
import { Download, FileText, RotateCcw, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { countWords } from "@/lib/betaPlanning";

const STORAGE_KEY = "sky.document-editor.v1";

type LocalDraft = {
  title: string;
  body: string;
  updatedAt: string;
};

function loadDraft(): LocalDraft {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      body: typeof parsed.body === "string" ? parsed.body : "",
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return { title: "", body: "", updatedAt: "" };
  }
}

export default function DocumentEditor() {
  const [title, setTitle] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [body, setBody] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    const saved = loadDraft();
    setTitle(saved.title);
    setBody(saved.body);
    setUpdatedAt(saved.updatedAt);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const nextUpdatedAt = new Date().toISOString();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ title, body, updatedAt: nextUpdatedAt }),
    );
    setUpdatedAt(nextUpdatedAt);
  }, [body, hydrated, title]);

  const resetDraft = () => {
    setTitle("");
    setBody("");
  };

  const downloadDraft = () => {
    const blob = new Blob([title.trim() ? title + "\n\n" + body : body], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = (title.trim() || "sky-document-draft").replace(/[^a-z0-9-_]+/gi, "-") + ".txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge variant="outline">Browser-local beta utility</Badge>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Document Editor</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Draft and export plain text locally without claiming cloud collaboration,
              shared editing, publication, or server persistence.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetDraft}>
              <RotateCcw className="mr-2 h-4 w-4" />
              New draft
            </Button>
            <Button onClick={downloadDraft} disabled={!title.trim() && !body.trim()}>
              <Download className="mr-2 h-4 w-4" />
              Export .txt
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Local draft
            </CardTitle>
            <CardDescription>
              Autosaves in this browser only. Clearing browser storage removes the saved draft.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Document title"
              aria-label="Document title"
              className="text-lg font-semibold"
            />
            <textarea
              value={body}
              onChange={event => setBody(event.target.value)}
              placeholder="Start writing..."
              rows={22}
              className="w-full resize-y rounded-md border border-input bg-background px-4 py-3 font-mono text-sm leading-6"
              aria-label="Document body"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <div className="flex gap-4">
                <span>{countWords(body)} words</span>
                <span>{body.length} characters</span>
              </div>
              <span className="inline-flex items-center gap-1">
                <Save className="h-3.5 w-3.5" />
                {updatedAt ? "Saved locally " + new Date(updatedAt).toLocaleTimeString() : "Local autosave ready"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
          No account sync, cloud backup, real-time collaboration, publishing workflow, or server persistence.
        </div>
      </div>
    </main>
  );
}
