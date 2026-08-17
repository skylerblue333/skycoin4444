import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Check,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "skycoin.comments-demo";
type DemoComment = {
  id: string;
  author: string;
  text: string;
  context: string;
  state: "Visible" | "Needs review";
};
const defaults: DemoComment[] = [
  {
    id: "demo-comment-1",
    author: "Example Contributor",
    text: "This is a local example comment for the review workspace.",
    context: "Demo community thread",
    state: "Visible",
  },
  {
    id: "demo-comment-2",
    author: "Sample Member",
    text: "A second sample helps demonstrate search and moderation intent.",
    context: "Demo education post",
    state: "Needs review",
  },
];

function readComments(): DemoComment[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaults;
    return parsed.filter(
      (value): value is DemoComment =>
        Boolean(value) &&
        typeof value === "object" &&
        typeof (value as DemoComment).id === "string" &&
        typeof (value as DemoComment).author === "string" &&
        typeof (value as DemoComment).text === "string" &&
        typeof (value as DemoComment).context === "string" &&
        ((value as DemoComment).state === "Visible" ||
          (value as DemoComment).state === "Needs review")
    );
  } catch {
    return defaults;
  }
}

export default function Comments() {
  const [comments, setComments] = useState<DemoComment[]>(defaults);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "Comment examples are saved."
  );
  useEffect(() => {
    setComments(readComments());
  }, []);
  const filteredComments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? comments.filter(comment =>
          `${comment.author} ${comment.text} ${comment.context}`
            .toLowerCase()
            .includes(normalized)
        )
      : comments;
  }, [comments, query]);
  const archive = (id: string) => {
    const next = comments.filter(comment => comment.id !== id);
    setComments(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPendingId(null);
    setStatusMessage("Local example comment archived.");
    toast.success("Example comment archived", {
      description: "This local action does not affect a real community thread.",
    });
  };
  const reset = () => {
    setComments(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setPendingId(null);
    setStatusMessage("Comment examples reset.");
    toast.success("Comment examples reset");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <MessageCircle className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Comments
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  demo
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Review sample conversation content without implying that posts
                are live, synchronized, or moderated server-side.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset examples
          </Button>
        </header>
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <ShieldAlert
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Local review workspace.
              </strong>{" "}
              The comments below are sample records stored on this device.
              Archive and review actions do not change a real thread or notify
              another user.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Review queue</CardTitle>
                <CardDescription>
                  {comments.length} local example{" "}
                  {comments.length === 1 ? "comment" : "comments"} currently
                  listed.
                </CardDescription>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search examples"
                  aria-label="Search comment examples"
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredComments.length > 0 ? (
              <div className="divide-y divide-border/70">
                {filteredComments.map(comment => (
                  <div
                    key={comment.id}
                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <div className="rounded-full border border-border/70 bg-muted p-2.5 text-muted-foreground">
                          <UserRound className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{comment.author}</p>
                            <Badge
                              variant={
                                comment.state === "Needs review"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {comment.state}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm leading-5 text-foreground/80">
                            {comment.text}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {comment.context} · local example
                          </p>
                        </div>
                      </div>
                      {pendingId !== comment.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPendingId(comment.id);
                            setStatusMessage(
                              `Confirm archiving the example comment from ${comment.author}.`
                            );
                          }}
                          aria-label={`Archive comment from ${comment.author}`}
                        >
                          <Archive className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                    {pendingId === comment.id && (
                      <div className="flex items-center justify-end gap-2 rounded-lg border border-border/70 bg-muted/30 p-3">
                        <span className="mr-auto text-sm text-muted-foreground">
                          Archive this local example?
                        </span>
                        <Button size="sm" onClick={() => archive(comment.id)}>
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPendingId(null)}
                          aria-label="Cancel archive"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <MessageCircle
                  className="mx-auto h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-medium">No matching examples</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try another search or reset the local examples.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              When comments are connected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Real moderation should be authorized server-side, use durable
              audit events, and distinguish pending, published, removed, and
              failed states.
            </p>
            <Separator />
            <p>
              This preview intentionally contains no live comments, user
              statistics, moderation claims, or notification delivery.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
