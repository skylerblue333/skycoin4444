import { useMemo, useState } from "react";
import { CheckSquare2 } from "lucide-react";
import { toggleSelection } from "@/lib/betaUtilityLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const options=["Social","Learning","Gaming","Creator","Privacy","Utilities"] as const;
export default function CheckboxGroupForm(){
 const [selected,setSelected]=useState<string[]>([]);
 const summary=useMemo(()=>selected.length?selected.join(", "):"None selected",[selected]);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Form interaction lab</Badge><h1 className="mt-3 text-3xl font-bold">Checkbox group form</h1><p className="mt-2 text-muted-foreground">Exercise multi-select behavior with clear state and reset controls.</p></header>
  <Card><CardHeader><CheckSquare2 className="h-5 w-5 text-primary"/><CardTitle className="mt-2">Choose beta interests</CardTitle><CardDescription>This is a local UI demonstration, not an account preference service.</CardDescription></CardHeader><CardContent className="space-y-3">{options.map(option=><label key={option} className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={selected.includes(option)} onChange={()=>setSelected(v=>toggleSelection(v,option))}/><span>{option}</span></label>)}<div className="rounded-xl bg-muted/40 p-4 text-sm">Selected: {summary}</div><Button type="button" variant="outline" onClick={()=>setSelected([])} disabled={!selected.length}>Reset</Button></CardContent></Card>
  <p className="text-xs text-muted-foreground">Selections are not saved, submitted, synchronized, or used for personalization.</p>
 </div></main>;
}
