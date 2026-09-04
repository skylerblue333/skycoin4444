import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const samples=[
 {id:"health",title:"Read beta health",language:"javascript",code:'const response = await fetch("/api/beta/health");\nconst health = await response.json();'},
 {id:"readiness",title:"Read beta readiness",language:"javascript",code:'const response = await fetch("/api/beta/readiness");\nconst readiness = await response.json();'},
 {id:"local",title:"Save browser-local draft",language:"javascript",code:'localStorage.setItem("draft", JSON.stringify({ title: "Beta note" }));'},
 {id:"typescript",title:"Typed fixture",language:"typescript",code:'type BetaRoute = { route: string; boundary: string };\nconst route: BetaRoute = { route: "/about", boundary: "Evidence only" };'},
] as const;

export default function CodeSamples(){
 const [query,setQuery]=useState(""); const [copied,setCopied]=useState<string|null>(null);
 const visible=useMemo(()=>{const q=query.trim().toLowerCase();return samples.filter(sample=>!q||[sample.title,sample.language,sample.code].some(value=>value.toLowerCase().includes(q)));},[query]);
 const copy=async(id:string,code:string)=>{await navigator.clipboard.writeText(code);setCopied(id);window.setTimeout(()=>setCopied(current=>current===id?null:current),1000);};
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-4xl space-y-6">
  <header><Badge variant="outline">Static developer examples</Badge><h1 className="mt-3 text-3xl font-bold">Code samples</h1><p className="mt-2 text-muted-foreground">Search and copy small examples that describe existing beta/local interfaces.</p></header>
  <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search examples"/></div>
  <div className="grid gap-4 md:grid-cols-2">{visible.map(sample=><Card key={sample.id}><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{sample.title}</CardTitle><CardDescription>{sample.language}</CardDescription></div><Button size="sm" variant="outline" onClick={()=>copy(sample.id,sample.code)}>{copied===sample.id?<Check className="mr-2 h-4 w-4"/>:<Copy className="mr-2 h-4 w-4"/>}{copied===sample.id?"Copied":"Copy"}</Button></div></CardHeader><CardContent><pre className="overflow-auto rounded-xl bg-muted p-4 text-xs"><code>{sample.code}</code></pre></CardContent></Card>)}</div>
  {!visible.length&&<p className="py-10 text-center text-sm text-muted-foreground">No matching samples.</p>}
  <p className="text-xs text-muted-foreground">Samples are static documentation snippets; this page does not execute them, provision services, create credentials, or contact external providers.</p>
 </div></main>;
}
