import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { countWords } from "@/lib/betaUtilities";
import { FilePenLine, RotateCcw, Save } from "lucide-react";

const STORAGE_KEY = "sky4444.beta-blog-draft";

type BlogDraft = {
  title: string;
  body: string;
  tags: string;
};

const emptyDraft: BlogDraft = {
  title: "",
  body: "",
  tags: "",
};

function parseDraft(value: string | null): BlogDraft {
  if (!value) return emptyDraft;
  try {
    const parsed = JSON.parse(value) as Partial<BlogDraft>;
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      body: typeof parsed.body === "string" ? parsed.body : "",
      tags: typeof parsed.tags === "string" ? parsed.tags : "",
    };
  } catch {
    return emptyDraft;
  }
}

export default function BlogEditor() {
  const [draft, setDraft] = useState<BlogDraft>(emptyDraft);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(parseDraft(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDraft(emptyDraft);
    setSaved(false);
  };

  const words = countWords(draft.body);
  const tags = draft.tags
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <header className="mb-8">
          <Badge variant="outline" className="mb-3">
            Launchable beta · local drafting
          </Badge>
          <h1 className="flex items-center gap-3 text-4xl font-black">
            <FilePenLine className="h-8 w-8 text-primary" />
            Blog Draft Studio
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Draft and preview long-form content with browser-local saving.
            Nothing is published, moderated, uploaded, or shared with another
            account from this surface.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Editor</CardTitle>
              <CardDescription>
                {words} word{words === 1 ? "" : "s"} · local save only
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="space-y-2 text-sm font-medium">
                Title
                <Input
                  value={draft.title}
                  maxLength={140}
                  onChange={event =>
                    setDraft(current => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="What are you writing about?"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Tags
                <Input
                  value={draft.tags}
                  maxLength={160}
                  onChange={event =>
                    setDraft(current => ({
                      ...current,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="engineering, beta, community"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Body
                <Textarea
                  value={draft.body}
                  maxLength={20_000}
                  onChange={event =>
                    setDraft(current => ({
                      ...current,
                      body: event.target.value,
                    }))
                  }
                  className="min-h-[28rem]"
                  placeholder="Write your draft..."
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <Button onClick={save}>
                  <Save className="mr-2 h-4 w-4" />
                  {saved ? "Saved locally" : "Save local draft"}
                </Button>
                <Button type="button" variant="ghost" onClick={clear}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safe preview</CardTitle>
              <CardDescription>
                Plain-text preview avoids executing draft HTML.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <article className="min-h-[28rem] rounded-2xl border bg-muted/25 p-6">
                {tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <h2 className="text-3xl font-black tracking-tight">
                  {draft.title.trim() || "Untitled draft"}
                </h2>
                <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {draft.body.trim() || "Your draft preview will appear here."}
                </div>
              </article>
            </CardContent>
          </Card>
        </div>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Boundary: no publication, remote collaboration, comments, revision
          history, moderation approval, media upload, or server persistence.
        </p>
      </div>
    </main>
  );
}
