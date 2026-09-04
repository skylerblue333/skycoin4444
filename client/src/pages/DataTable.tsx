import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { filterDemoRecords, sortDemoRecords, type DemoRecord } from "@/lib/betaInteractionLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const fixtures:DemoRecord[]=[
 {id:"1",label:"Beta workspace",group:"Navigation",detail:"Launchable-route directory"},
 {id:"2",label:"Privacy center",group:"Safety",detail:"Export and deletion-request intake"},
 {id:"3",label:"Arcade",group:"Gaming",detail:"Deterministic local games"},
 {id:"4",label:"SkySchool",group:"Learning",detail:"Persisted beta learning journey"},
 {id:"5",label:"Activity evidence",group:"Account",detail:"Account-owned persisted evidence"},
];

export default function DataTable(){
 const [query,setQuery]=useState(""); const [sortField,setSortField]=useState<"label"|"group">("label"); const [direction,setDirection]=useState<"asc"|"desc">("asc");
 const rows=useMemo(()=>sortDemoRecords(filterDemoRecords(fixtures,query),sortField,direction),[query,sortField,direction]);
 const changeSort=(field:typeof sortField)=>{if(field===sortField)setDirection(v=>v==="asc"?"desc":"asc");else{setSortField(field);setDirection("asc");}};
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-4xl space-y-6">
  <header><Badge variant="outline">Fixture table lab</Badge><h1 className="mt-3 text-3xl font-bold">Data table</h1><p className="mt-2 text-muted-foreground">Filter and sort a static beta-area fixture dataset.</p></header>
  <Card><CardHeader><CardTitle>Fixture records</CardTitle><CardDescription>No live database rows or production analytics are displayed.</CardDescription><div className="relative mt-3"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search rows"/></div></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="p-3 text-left"><Button variant="ghost" size="sm" onClick={()=>changeSort("label")}>Name<ArrowUpDown className="ml-2 h-3.5 w-3.5"/></Button></th><th className="p-3 text-left"><Button variant="ghost" size="sm" onClick={()=>changeSort("group")}>Group<ArrowUpDown className="ml-2 h-3.5 w-3.5"/></Button></th><th className="p-3 text-left">Detail</th></tr></thead><tbody>{rows.map(row=><tr key={row.id} className="border-b last:border-0"><td className="p-3 font-medium">{row.label}</td><td className="p-3">{row.group}</td><td className="p-3 text-muted-foreground">{row.detail}</td></tr>)}</tbody></table>{rows.length===0&&<p className="py-10 text-center text-sm text-muted-foreground">No matching fixture records.</p>}</div></CardContent></Card>
  <p className="text-xs text-muted-foreground">No remote query, pagination API, user data, analytics pipeline, or production metric is involved.</p>
 </div></main>;
}
