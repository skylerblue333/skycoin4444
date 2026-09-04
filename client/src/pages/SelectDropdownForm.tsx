import { useState } from "react";
import { normalizeSingleChoice } from "@/lib/betaInteractionLab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const allowed=["bug","feedback","question"] as const;
export default function SelectDropdownForm(){
 const [value,setValue]=useState("feedback");
 const select=(next:string)=>setValue(normalizeSingleChoice(next,allowed,"feedback"));
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Select form lab</Badge><h1 className="mt-3 text-3xl font-bold">Select dropdown form</h1><p className="mt-2 text-muted-foreground">Test a bounded single-choice select without submitting a real ticket.</p></header>
  <Card><CardHeader><CardTitle>Fixture request type</CardTitle><CardDescription>The option is held only in React state.</CardDescription></CardHeader><CardContent className="space-y-4"><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={value} onChange={e=>select(e.target.value)}>{allowed.map(option=><option key={option} value={option}>{option}</option>)}</select><div className="rounded-xl bg-muted/40 p-4 text-sm">Current local value: <strong>{value}</strong></div></CardContent></Card>
  <p className="text-xs text-muted-foreground">No support ticket, feedback record, notification, or server request is created.</p>
 </div></main>;
}
