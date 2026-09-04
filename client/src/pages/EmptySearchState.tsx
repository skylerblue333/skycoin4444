import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { filterDemoRecords, type DemoRecord } from "@/lib/betaInteractionLab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const records:DemoRecord[]=[
 {id:"1",label:"Notes",group:"Utility",detail:"Browser-local notes"},
 {id:"2",label:"Quiz builder",group:"Learning",detail:"Local deterministic quiz builder"},
 {id:"3",label:"Privacy center",group:"Safety",detail:"Authenticated privacy workflows"},
];
export default function EmptySearchState(){
 const [query,setQuery]=useState("nonexistent");
 const matches=useMemo(()=>filterDemoRecords(records,query),[query]);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Search-state lab</Badge><h1 className="mt-3 text-3xl font-bold">Empty search state</h1><p className="mt-2 text-muted-foreground">Test both matching and zero-result search states over labeled fixtures.</p></header>
  <Card><CardHeader><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try notes or privacy"/></div><CardDescription>Search runs only against the three local fixtures on this page.</CardDescription></CardHeader><CardContent>{matches.length===0?<div className="py-12 text-center"><SearchX className="mx-auto h-10 w-10 text-muted-foreground"/><CardTitle className="mt-3 text-lg">No results</CardTitle><p className="mt-2 text-sm text-muted-foreground">Try a broader term. No remote fallback search is performed.</p></div>:<div className="space-y-3">{matches.map(item=><div key={item.id} className="rounded-xl border p-4"><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.group} · {item.detail}</p></div>)}</div>}</CardContent></Card>
  <p className="text-xs text-muted-foreground">No search history, personalization, external index, AI retrieval, or server request is used.</p>
 </div></main>;
}
