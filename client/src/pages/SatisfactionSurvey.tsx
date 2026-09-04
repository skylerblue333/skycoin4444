import { FormEvent, useEffect, useState } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type SurveyEntry = {
  id: string;
  area: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const STORAGE_KEY = "skycoin4444-beta-csat-v1";

function loadEntries(): SurveyEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SatisfactionSurvey() {
  const [entries, setEntries] = useState<SurveyEntry[]>(loadEntries);
  const [area, setArea] = useState("overall");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (rating < 1 || rating > 5) return;
    setEntries(current => [
      {
        id: crypto.randomUUID(),
        area,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setRating(0);
    setComment("");
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline">Browser-local survey lab</Badge>
          <h1 className="mt-3 text-3xl font-bold">Satisfaction survey</h1>
          <p className="mt-2 text-muted-foreground">
            Capture local CSAT notes while testing. Use Beta Feedback for
            durable server-side bug and evidence reports.
          </p>
        </header>

        <Card>
          <CardHeader>
            <Star className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Rate a beta area</CardTitle>
            <CardDescription>1 = poor, 5 = excellent.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <select
                value={area}
                onChange={event => setArea(event.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="overall">Overall beta</option>
                <option value="navigation">Navigation</option>
                <option value="social">Social</option>
                <option value="learning">SkySchool</option>
                <option value="gaming">Gaming</option>
                <option value="privacy">Privacy</option>
              </select>
              <div className="flex gap-2" aria-label="Satisfaction rating">
                {[1, 2, 3, 4, 5].map(value => (
                  <Button
                    key={value}
                    type="button"
                    variant={rating === value ? "default" : "outline"}
                    size="icon"
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} of 5`}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <Textarea
                value={comment}
                maxLength={500}
                onChange={event => setComment(event.target.value)}
                placeholder="Optional testing note"
              />
              <Button type="submit" disabled={rating === 0}>
                Save local response
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local response history</CardTitle>
            <CardDescription>
              These entries never leave this browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No local survey responses yet.
              </p>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">
                      {entry.area} · {entry.rating}/5
                    </p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setEntries(current =>
                          current.filter(item => item.id !== entry.id)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {entry.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {entry.comment}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Need a durable report?</p>
              <p className="text-sm text-muted-foreground">
                Beta Feedback persists authenticated bug and evidence reports.
              </p>
            </div>
            <Link href="/beta-feedback">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Open Beta Feedback
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
