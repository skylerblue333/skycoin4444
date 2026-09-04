import { useState } from "react";
import { Gauge } from "lucide-react";
import { clampProgress } from "@/lib/betaPresentationLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function ProgressBar(){
 const [value,setValue]=useState(42);
 const update=(next:number)=>setValue(clampProgress(next));
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Progress interaction lab</Badge><h1 className="mt-3 text-3xl font-bold">Progress bar</h1><p className="mt-2 text-muted-foreground">Exercise accessible bounded progress state from 0 to 100.</p></header>
  <Card><CardHeader><Gauge className="h-5 w-5 text-primary"/><CardTitle className="mt-2">{value}% complete</CardTitle><CardDescription>This is user-controlled demo state, not measured product completion.</CardDescription></CardHeader><CardContent className="space-y-5"><Progress value={value}/><input type="range" min={0} max={100} value={value} onChange={e=>update(Number(e.target.value))} className="w-full" aria-label="Progress percentage"/><div className="flex gap-2"><Button variant="outline" onClick={()=>update(value-10)}>-10</Button><Button variant="outline" onClick={()=>update(value+10)}>+10</Button><Input type="number" min={0} max={100} value={value} onChange={e=>update(Number(e.target.value))}/></div></CardContent></Card>
  <p className="text-xs text-muted-foreground">This component does not infer deployment, business, learning, financial, or user progress.</p>
 </div></main>;
}
