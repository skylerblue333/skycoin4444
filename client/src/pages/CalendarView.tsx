import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { buildMonthCells } from "@/lib/betaPresentationLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;
export default function CalendarView(){
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [month,setMonth]=useState(now.getMonth());
  const [selected,setSelected]=useState<string|null>(null);
  const cells=useMemo(()=>buildMonthCells(year,month),[year,month]);
  const label=new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(year,month,1)));
  const move=(delta:number)=>{const next=new Date(Date.UTC(year,month+delta,1));setYear(next.getUTCFullYear());setMonth(next.getUTCMonth());setSelected(null);};
  return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-3xl space-y-6">
    <header><Badge variant="outline">Deterministic calendar lab</Badge><h1 className="mt-3 text-3xl font-bold">Calendar view</h1><p className="mt-2 text-muted-foreground">Navigate month grids and select a date without any external calendar service.</p></header>
    <Card><CardHeader><div className="flex items-center justify-between gap-3"><Button size="icon" variant="outline" onClick={()=>move(-1)} aria-label="Previous month"><ChevronLeft className="h-4 w-4"/></Button><div className="text-center"><CalendarDays className="mx-auto h-5 w-5 text-primary"/><CardTitle className="mt-2">{label}</CardTitle><CardDescription>{selected ? "Selected " + selected : "Choose a date"}</CardDescription></div><Button size="icon" variant="outline" onClick={()=>move(1)} aria-label="Next month"><ChevronRight className="h-4 w-4"/></Button></div></CardHeader><CardContent><div className="grid grid-cols-7 gap-1">{weekdays.map(day=><div key={day} className="p-2 text-center text-xs font-semibold text-muted-foreground">{day}</div>)}{cells.map(cell=><button key={cell.key} type="button" disabled={!cell.isoDate} onClick={()=>cell.isoDate&&setSelected(cell.isoDate)} className={"aspect-square rounded-lg border text-sm disabled:border-transparent "+(selected===cell.isoDate?"border-primary bg-primary text-primary-foreground":"hover:bg-muted")}>{cell.day??""}</button>)}</div></CardContent></Card>
    <p className="text-xs text-muted-foreground">No Google/iCloud sync, event storage, reminders, invitations, or server persistence is provided.</p>
  </div></main>;
}
