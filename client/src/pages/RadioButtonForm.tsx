import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const options=["comfortable","compact","system"] as const;
export default function RadioButtonForm(){
 const [value,setValue]=useState<(typeof options)[number]>("comfortable");
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Radio form lab</Badge><h1 className="mt-3 text-3xl font-bold">Radio button form</h1><p className="mt-2 text-muted-foreground">Exercise mutually exclusive choice behavior with an explicit current value.</p></header>
  <Card><CardHeader><CardTitle>Choose a fixture preference</CardTitle><CardDescription>This page does not write to account settings.</CardDescription></CardHeader><CardContent className="space-y-3">{options.map(option=><label key={option} className="flex items-center gap-3 rounded-xl border p-3"><input type="radio" name="demo-density" value={option} checked={value===option} onChange={()=>setValue(option)}/><span className="capitalize">{option}</span></label>)}<p className="rounded-xl bg-muted/40 p-4 text-sm">Current local choice: <strong>{value}</strong></p></CardContent></Card>
  <p className="text-xs text-muted-foreground">No preference is persisted, synchronized, submitted, or applied to the rest of the application.</p>
 </div></main>;
}
