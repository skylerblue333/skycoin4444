import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageWindow } from "@/lib/betaPresentationLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const items=Array.from({length:37},(_,index)=>({id:index+1,label:"Fixture item "+(index+1)}));
export default function Pagination(){
 const [page,setPage]=useState(1); const [size,setSize]=useState(5);
 const windowed=useMemo(()=>getPageWindow(items,page,size),[page,size]);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Pagination lab</Badge><h1 className="mt-3 text-3xl font-bold">Pagination</h1><p className="mt-2 text-muted-foreground">Test bounded paging over a deterministic local fixture list.</p></header>
  <Card><CardHeader><CardTitle>Page {windowed.page} of {windowed.pageCount}</CardTitle><CardDescription>37 labeled fixture records; no remote fetch.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2">{windowed.items.map(item=><div key={item.id} className="rounded-lg border p-3">{item.label}</div>)}</div><div className="flex flex-wrap items-center gap-2"><Button size="icon" variant="outline" disabled={windowed.page===1} onClick={()=>setPage(v=>v-1)}><ChevronLeft className="h-4 w-4"/></Button>{Array.from({length:windowed.pageCount},(_,i)=>i+1).map(value=><Button key={value} size="sm" variant={windowed.page===value?"default":"outline"} onClick={()=>setPage(value)}>{value}</Button>)}<Button size="icon" variant="outline" disabled={windowed.page===windowed.pageCount} onClick={()=>setPage(v=>v+1)}><ChevronRight className="h-4 w-4"/></Button><select className="ml-auto h-9 rounded-md border bg-background px-2 text-sm" value={size} onChange={e=>{setSize(Number(e.target.value));setPage(1);}}><option value={5}>5/page</option><option value={10}>10/page</option></select></div></CardContent></Card>
  <p className="text-xs text-muted-foreground">No API pagination, cursor persistence, remote dataset, or account state is involved.</p>
 </div></main>;
}
