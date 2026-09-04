import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildMonthGrid } from "@/lib/betaFormUtilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

function initialMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export default function DatePickerDialog() {
  const initial = initialMonth();
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [selected, setSelected] = useState<string | null>(null);
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const move = (delta: number) => {
    const next = new Date(Date.UTC(year, month + delta, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth());
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <Badge variant="outline">Local calendar component lab</Badge>
          <h1 className="mt-3 text-3xl font-bold">Date picker</h1>
          <p className="mt-2 text-muted-foreground">
            Navigate a deterministic six-week month grid and select one date.
          </p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <Button type="button" size="icon" variant="outline" onClick={() => move(-1)} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <CardTitle>{MONTHS[month]} {year}</CardTitle>
                <CardDescription>{selected ? "Selected " + selected : "No date selected"}</CardDescription>
              </div>
              <Button type="button" size="icon" variant="outline" onClick={() => move(1)} aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map(cell => (
                <Button
                  key={cell.date}
                  type="button"
                  variant={selected === cell.date ? "default" : "ghost"}
                  className={!cell.inMonth ? "opacity-35" : ""}
                  onClick={() => setSelected(cell.date)}
                  aria-label={"Select " + cell.date}
                >
                  {cell.day}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Selection is session-only. No event creation, calendar provider integration, reminder scheduling, or booking is performed.
        </p>
      </div>
    </main>
  );
}
