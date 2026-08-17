import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  RotateCcw,
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
import { Separator } from "@/components/ui/separator";

type EventItem = {
  id: string;
  day: number;
  month: number;
  title: string;
  category: "Learning" | "Community" | "Planning";
  time: string;
  location: string;
};
const events: EventItem[] = [
  {
    id: "event-1",
    day: 8,
    month: 0,
    title: "Sample learning review",
    category: "Learning",
    time: "09:30",
    location: "Local preview",
  },
  {
    id: "event-2",
    day: 14,
    month: 0,
    title: "Community welcome example",
    category: "Community",
    time: "13:00",
    location: "Local preview",
  },
  {
    id: "event-3",
    day: 22,
    month: 0,
    title: "Weekly planning block",
    category: "Planning",
    time: "16:30",
    location: "Local preview",
  },
];

export default function CalendarView() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(8);
  const [category, setCategory] = useState<EventItem["category"] | "All">(
    "All"
  );
  const baseDate = new Date(2026, 0, 1);
  const currentDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + monthOffset,
    1
  );
  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = new Date(year, month, 1).getDay();
  const visibleEvents = useMemo(
    () =>
      events.filter(
        event =>
          event.month === month &&
          (category === "All" || event.category === category)
      ),
    [category, month]
  );
  const selectedEvents = visibleEvents.filter(
    event => event.day === selectedDay
  );
  const reset = () => {
    setMonthOffset(0);
    setSelectedDay(8);
    setCategory("All");
    toast.success("Calendar preview reset");
  };
  const cells = Array.from({ length: leadingDays + daysInMonth }, (_, index) =>
    index < leadingDays ? null : index - leadingDays + 1
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing {monthName}. {selectedEvents.length} sample events selected.
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <CalendarDays className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Calendar view
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  preview
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Plan around sample events without implying external calendar
                synchronization, reminders, or bookings.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset preview
          </Button>
        </header>
        <Card className="border-sky-500/30 bg-sky-500/10">
          <CardContent className="p-4 text-sm leading-5 text-foreground/75">
            <strong className="font-medium text-foreground">
              Local planning preview.
            </strong>{" "}
            The events below are examples for layout and interaction testing.
            They are not synced, scheduled, or sent to another calendar.
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_290px]">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{monthName}</CardTitle>
                  <CardDescription>
                    {visibleEvents.length} sample events in this view.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMonthOffset(value => value - 1)}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMonthOffset(value => value + 1)}
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <span key={day} className="py-2">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, index) => {
                  const hasEvent =
                    typeof day === "number" &&
                    visibleEvents.some(event => event.day === day);
                  const selected = day === selectedDay;
                  return (
                    <button
                      key={`${day ?? "empty"}-${index}`}
                      type="button"
                      disabled={day === null}
                      onClick={() => day !== null && setSelectedDay(day)}
                      className={`min-h-12 rounded-lg border p-2 text-left text-sm transition-colors ${day === null ? "border-transparent" : selected ? "border-primary bg-primary/10" : "border-border/60 hover:bg-muted"}`}
                      aria-label={
                        day === null
                          ? undefined
                          : `${monthName} ${day}${hasEvent ? ", has sample events" : ""}`
                      }
                      aria-pressed={selected}
                    >
                      {day !== null && (
                        <>
                          <span className="font-medium">{day}</span>
                          {hasEvent && (
                            <span
                              className="mt-2 block h-1.5 w-1.5 rounded-full bg-primary"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">Selected day</CardTitle>
                    <CardDescription>
                      {monthName} {selectedDay}
                    </CardDescription>
                  </div>
                  <CalendarDays
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {selectedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEvents.map(event => (
                      <div key={event.id} className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-medium">{event.title}</h3>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Clock3
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            {event.time}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sample events on this day.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Filter examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={category}
                  onChange={event =>
                    setCategory(
                      event.target.value as EventItem["category"] | "All"
                    )
                  }
                  aria-label="Filter calendar examples"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="All">All categories</option>
                  <option value="Learning">Learning</option>
                  <option value="Community">Community</option>
                  <option value="Planning">Planning</option>
                </select>
                <Separator className="my-4" />
                <p className="text-xs leading-5 text-muted-foreground">
                  When connected, calendar integrations should disclose
                  permissions, sync status, and failed writes clearly.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
