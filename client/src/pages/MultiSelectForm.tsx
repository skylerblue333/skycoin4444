import { useMemo, useState } from "react";
import { countSelected, toggleUnique } from "@/lib/betaInteractionLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const options=["Social","Learning","Gaming","Creator","Privacy","Utilities"] as const;
export default function MultiSelectForm(){
 const [selected,setSelected]=useState<string[]>(["Learning"]);
 const count=useMemo(()=>countSelected(selected,options),[selected]);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Multi-select form lab</Badge><h1 className="mt-3 text-3xl font-bold">Multi-select form</h1><p className="mt-2 text-muted-foreground">Exercise bounded multi-selection, summary, and reset behavior.</p></header>
  <Card><CardHeader><CardTitle>Choose demo interests</CardTitle><CardDescription>{count} of {options.length} selected.</CardDescription></CardHeader><CardContent className="space-y-3">{options.map(option=><label key={option} className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={selected.includes(option)} onChange={()=>setSelected(v=>toggleUnique(v,option))}/><span>{option}</span></label>)}<div className="rounded-xl bg-muted/40 p-4 text-sm">Selected: {selected.length?selected.join(", "):"None"}</div><Button variant="outline" onClick={()=>setSelected([])} disabled={!selected.length}>Reset locally</Button></CardContent></Card>
  <p className="text-xs text-muted-foreground">Selections are not submitted, saved to an account, synchronized, or used for personalization.</p>
 </div></main>;
}
