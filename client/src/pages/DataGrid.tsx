import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { filterAndSortRows, type GridRow } from "@/lib/betaPresentationLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const rows:GridRow[]=[
 {id:"1",name:"Activation journey",category:"Account",score:92},
 {id:"2",name:"Arcade lab",category:"Gaming",score:84},
 {id:"3",name:"SkySchool",category:"Learning",score:88},
 {id:"4",name:"Privacy center",category:"Safety",score:95},
 {id:"5",name:"Creator studio",category:"Creator",score:78},
 {id:"6",name:"Route search",category:"Navigation",score:90},
];
export default function DataGrid(){
 const [query,setQuery]=useState(""); const [sortBy,setSortBy]=useState<"name"|"category"|"score">("name"); const [direction,setDirection]=useState<"asc"|"desc">("asc");
 const visible=useMemo(()=>filterAndSortRows(rows,query,sortBy,direction),[query,sortBy,direction]);
 const changeSort=(column:typeof sortBy)=>{if(sortBy===column)setDirection(v=>v==="asc"?"desc":"asc");else{setSortBy(column);setDirection("asc");}};
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-4xl space-y-6">
  <header><Badge variant="outline">Fixture data interaction lab</Badge><h1 className="mt-3 text-3xl font-bold">Data grid</h1><p className="mt-2 text-muted-foreground">Search and sort a clearly labeled local fixture dataset.</p></header>
  <Card><CardHeader><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter rows"/></div><CardDescription>Scores are fixture values for UI testing, not live quality metrics.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b">{(["name","category","score"] as const).map(column=><th key={column} className="p-3 text-left"><Button variant="ghost" size="sm" onClick={()=>changeSort(column)}>{column}<ArrowUpDown className="ml-2 h-3.5 w-3.5"/></Button></th>)}</tr></thead><tbody>{visible.map(row=><tr key={row.id} className="border-b last:border-0"><td className="p-3">{row.name}</td><td className="p-3">{row.category}</td><td className="p-3">{row.score}</td></tr>)}</tbody></table>{!visible.length&&<p className="py-10 text-center text-muted-foreground">No matching rows.</p>}</div></CardContent></Card>
  <p className="text-xs text-muted-foreground">No remote database query, analytics service, user data, or production metrics are used.</p>
 </div></main>;
}
