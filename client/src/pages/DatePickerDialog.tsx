import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Info,
  RotateCcw,
  Sparkles,
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
import { Label } from "@/components/ui/label";

const initialDate = "2026-01-14";
function formatDate(value: string) {
  if (!value) return "No date selected";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
function offsetDate(days: number) {
  const date = new Date("2026-01-14T12:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function DatePickerDialog() {
  const [date, setDate] = useState(initialDate);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [statusMessage, setStatusMessage] = useState(
    "Local date preview is ready."
  );
  const changed = date !== savedDate;
  const summary = useMemo(() => formatDate(date), [date]);
  const selectDate = (value: string) => {
    setDate(value);
    setStatusMessage(
      value
        ? `Selected ${formatDate(value)}. Unsaved local preview change.`
        : "Date cleared. Unsaved local preview change."
    );
  };
  const save = () => {
    setSavedDate(date);
    setStatusMessage(`Date preview saved as ${formatDate(date)}.`);
    toast.success("Date preview saved", {
      description: "No booking or reminder was created.",
    });
  };
  const reset = () => {
    setDate(initialDate);
    setSavedDate(initialDate);
    setStatusMessage("Date preview reset to January 14, 2026.");
    toast.success("Date preview reset");
  };
  const clear = () => selectDate("");

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <CalendarDays className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Date picker
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  preview
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Choose a date for a sample workflow without implying
                availability, booking, reminders, or calendar writes.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset preview
          </Button>
        </header>
        <Card className="border-sky-500/30 bg-sky-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Local date preview only.
              </strong>{" "}
              This selection stays on the screen and does not reserve a slot,
              create a reminder, or write to an external calendar.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle>Choose a date</CardTitle>
              <CardDescription>
                Use the native date control or one of the local sample presets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date-input">Selected date</Label>
                <div className="flex gap-2">
                  <input
                    id="date-input"
                    type="date"
                    value={date}
                    onChange={event => selectDate(event.target.value)}
                    className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-describedby="date-help"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clear}
                    disabled={!date}
                    aria-label="Clear selected date"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <p id="date-help" className="text-xs text-muted-foreground">
                  Dates are shown in your browser's local date format.
                </p>
              </div>
              <div className="space-y-3">
                <Label>Quick presets</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    onClick={() => selectDate(initialDate)}
                    className="h-auto justify-start p-3 text-left"
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        Sample day
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Jan 14, 2026
                      </span>
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => selectDate(offsetDate(7))}
                    className="h-auto justify-start p-3 text-left"
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        Next week
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Jan 21, 2026
                      </span>
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => selectDate(offsetDate(30))}
                    className="h-auto justify-start p-3 text-left"
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        In 30 days
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Feb 13, 2026
                      </span>
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {changed ? "Unsaved preview change" : "Preview saved"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {summary}
                  </p>
                </div>
                <Button
                  onClick={save}
                  disabled={!changed || !date}
                  className="gap-2"
                >
                  {changed ? "Save date" : "Saved"}
                  <Check className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Selection summary</CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  Local preview state only.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarDays
                  className="mb-4 h-8 w-8 opacity-80"
                  aria-hidden="true"
                />
                <p className="text-xl font-semibold">{summary}</p>
                {!date && (
                  <p className="mt-2 text-sm text-primary-foreground/75">
                    Choose a date to continue the preview.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  When connected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Real scheduling should disclose time zone, availability
                  source, confirmation state, and failed writes.
                </p>
                <p>
                  This screen intentionally performs none of those external
                  actions.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
