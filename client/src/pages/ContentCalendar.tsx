import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { sortContentPlanItems, validateContentPlanItem, type ContentPlanItem } from "@/lib/betaUtilityLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const KEY="skycoin4444-beta-content-calendar-v1";
function load():ContentPlanItem[]{try{const v=JSON.parse(localStorage.getItem(KEY)??"[]");return Array.isArray(v)?v:[]}catch{return[]}}

export default function ContentCalendar(){
  const [items,setItems]=useState<ContentPlanItem[]>(load);
  const [title,setTitle]=useState(""); const [channel,setChannel]=useState("social"); const [date,setDate]=useState(""); const [status,setStatus]=useState<ContentPlanItem["status"]>("idea"); const [error,setError]=useState("");
  useEffect(()=>localStorage.setItem(KEY,JSON.stringify(items)),[items]);
  const ordered=useMemo(()=>sortContentPlanItems(items),[items]);
  const submit=(e:FormEvent)=>{e.preventDefault();const draft={title,channel,date,status};const errors=validateContentPlanItem(draft);if(errors.length){setError(errors.join(". "));return;}setItems(v=>[...v,{id:crypto.randomUUID(),...draft}]);setTitle("");setDate("");setError("");};
  return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-4xl space-y-6">
    <header><Badge variant="outline">Browser-local planner</Badge><h1 className="mt-3 text-3xl font-bold">Content calendar</h1><p className="mt-2 text-muted-foreground">Plan content by date, channel, and readiness without publishing anything.</p></header>
    <Card><CardHeader><CalendarDays className="h-5 w-5 text-primary"/><CardTitle className="mt-2">Add content item</CardTitle><CardDescription>Stored only in this browser.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="grid gap-3 md:grid-cols-4"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/><Input value={channel} onChange={e=>setChannel(e.target.value)} placeholder="Channel"/><Input type="date" value={date} onChange={e=>setDate(e.target.value)}/><select className="h-10 rounded-md border bg-background px-3 text-sm" value={status} onChange={e=>setStatus(e.target.value as ContentPlanItem["status"])}><option value="idea">Idea</option><option value="draft">Draft</option><option value="ready">Ready</option></select><div className="md:col-span-4"><Button type="submit"><Plus className="mr-2 h-4 w-4"/>Add item</Button>{error&&<p className="mt-2 text-sm text-destructive">{error}</p>}</div></form></CardContent></Card>
    <Card><CardHeader><CardTitle>Planned content</CardTitle></CardHeader><CardContent className="space-y-3">{ordered.length===0?<p className="py-8 text-center text-sm text-muted-foreground">No content planned yet.</p>:ordered.map(item=><div key={item.id} className="flex items-center gap-3 rounded-xl border p-4"><div className="min-w-0 flex-1"><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.date} · {item.channel} · {item.status}</p></div><Button size="icon" variant="ghost" onClick={()=>setItems(v=>v.filter(x=>x.id!==item.id))}><Trash2 className="h-4 w-4"/></Button></div>)}</CardContent></Card>
    <p className="text-xs text-muted-foreground">No scheduling API, social publishing, collaboration, analytics, or server sync is provided.</p>
  </div></main>;
}
