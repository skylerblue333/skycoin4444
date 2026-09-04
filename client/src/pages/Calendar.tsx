import { useEffect, useMemo, useState } from "react";
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
import {
  normalizeCalendarEvents,
  validateCalendarEvent,
  type LocalCalendarEvent,
} from "@/lib/betaUtilities";
import { CalendarDays, CheckCircle2, Circle, Trash2 } from "lucide-react";

const STORAGE_KEY = "sky4444.beta-calendar-events";

export default function Calendar() {
  const [events, setEvents] = useState<LocalCalendarEvent[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "completed">("open");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    try {
      setEvents(
        normalizeCalendarEvents(
          JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
        )
      );
    } catch {
      setEvents([]);
    }
  }, []);

  const persist = (next: LocalCalendarEvent[]) => {
    setEvents(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addEvent = () => {
    const nextErrors = validateCalendarEvent({ title, date, notes });
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    const event: LocalCalendarEvent = {
      id: `${date}:${title.trim()}:${events.length + 1}`,
      title: title.trim(),
      date,
      notes: notes.trim(),
      completed: false,
    };
    persist(
      [...events, event].sort((a, b) =>
        a.date.localeCompare(b.date) || a.title.localeCompare(b.title)
      )
    );
    setTitle("");
    setDate("");
    setNotes("");
  };

  const visible = useMemo(
    () =>
      events.filter(event =>
        filter === "all"
          ? true
          : filter === "completed"
            ? event.completed
            : !event.completed
      ),
    [events, filter]
  );

  const toggle = (id: string) =>
    persist(
      events.map(event =>
        event.id === id ? { ...event, completed: !event.completed } : event
      )
    );

  const remove = (id: string) =>
    persist(events.filter(event => event.id !== id));

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <Badge variant="outline" className="mb-3">
            Launchable beta · browser-local
          </Badge>
          <h1 className="flex items-center gap-3 text-4xl font-black">
            <CalendarDays className="h-8 w-8 text-primary" />
            Local Calendar
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Create, complete, filter, and restore personal planning events.
            Nothing syncs to Google Calendar, iCloud, email, notifications, or a
            SKYCOIN4444 server.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Add an event</CardTitle>
              <CardDescription>
                Events persist only in this browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="space-y-2 text-sm font-medium">
                Title
                <Input
                  value={title}
                  maxLength={120}
                  onChange={event => setTitle(event.target.value)}
                  placeholder="Beta review"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Date
                <Input
                  type="date"
                  value={date}
                  onChange={event => setDate(event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Notes
                <Textarea
                  value={notes}
                  maxLength={500}
                  onChange={event => setNotes(event.target.value)}
                  placeholder="Optional details"
                />
              </label>
              {errors.length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {errors.map(error => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
              <Button onClick={addEvent} className="w-full">
                Add local event
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Schedule</CardTitle>
                  <CardDescription>
                    {events.length} saved event{events.length === 1 ? "" : "s"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {(["open", "completed", "all"] as const).map(value => (
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
              </div>
            </CardHeader>
            <CardContent>
              {visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No events match this filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {visible.map(event => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 rounded-2xl border p-4"
                    >
                      <button
                        type="button"
                        aria-label={
                          event.completed
                            ? "Mark event incomplete"
                            : "Mark event complete"
                        }
                        className="mt-0.5 text-primary"
                        onClick={() => toggle(event.id)}
                      >
                        {event.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <strong
                            className={
                              event.completed
                                ? "text-muted-foreground line-through"
                                : ""
                            }
                          >
                            {event.title}
                          </strong>
                          <Badge variant="secondary">{event.date}</Badge>
                        </div>
                        {event.notes && (
                          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                            {event.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Delete event"
                        onClick={() => remove(event.id)}
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
      </div>
    </main>
  );
}
