import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { dateDistanceDays, normalizeDateOnly } from "@/lib/betaFormUtilities";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function localToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export default function DateInputForm() {
  const [date, setDate] = useState(localToday);
  const [reference, setReference] = useState(localToday);

  const summary = useMemo(() => {
    const validDate = normalizeDateOnly(date);
    const validReference = normalizeDateOnly(reference);
    if (!validDate || !validReference) return null;
    const distance = dateDistanceDays(validReference, validDate);
    return {
      distance,
      relation: distance === 0 ? "same day" : distance > 0 ? "after" : "before",
    };
  }, [date, reference]);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <Badge variant="outline">Local form lab</Badge>
          <h1 className="mt-3 text-3xl font-bold">Date input</h1>
          <p className="mt-2 text-muted-foreground">
            Validate date-only values and compare two calendar dates without timezone drift.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CalendarDays className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Compare dates</CardTitle>
            <CardDescription>Both values use the browser&apos;s native date input.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Selected date
              <Input type="date" value={date} onChange={event => setDate(event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Reference date
              <Input type="date" value={reference} onChange={event => setReference(event.target.value)} />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation result</CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <p className="text-sm">
                The selected date is <strong>{Math.abs(summary.distance)} day{Math.abs(summary.distance) === 1 ? "" : "s"}</strong>{" "}
                {summary.relation} the reference date.
              </p>
            ) : (
              <p className="text-sm text-destructive">Enter two valid calendar dates.</p>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          No appointment booking, reminder delivery, calendar sync, or server persistence is provided.
        </p>
      </div>
    </main>
  );
}
