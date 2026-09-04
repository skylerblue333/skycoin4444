import { useMemo, useState } from "react";
import { Navigation } from "lucide-react";
import { buildBreadcrumbs } from "@/lib/betaPresentationLab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function BreadcrumbNavigation(){
 const [path,setPath]=useState("/beta-workspace/privacy/settings");
 const items=useMemo(()=>buildBreadcrumbs(path),[path]);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-3xl space-y-6">
  <header><Badge variant="outline">Navigation lab</Badge><h1 className="mt-3 text-3xl font-bold">Breadcrumb navigation</h1><p className="mt-2 text-muted-foreground">Normalize a path into a readable breadcrumb trail.</p></header>
  <Card><CardHeader><Navigation className="h-5 w-5 text-primary"/><CardTitle className="mt-2">Path preview</CardTitle><CardDescription>Type a local route-like path; no navigation or network request occurs.</CardDescription></CardHeader><CardContent className="space-y-5"><Input value={path} onChange={e=>setPath(e.target.value)} placeholder="/section/item"/><div className="rounded-xl border p-4"><Breadcrumb><BreadcrumbList>{items.map((item,index)=><span key={item.path} className="contents"><BreadcrumbItem>{index===items.length-1?<BreadcrumbPage>{item.label}</BreadcrumbPage>:<BreadcrumbLink href={item.path} onClick={event=>event.preventDefault()}>{item.label}</BreadcrumbLink>}</BreadcrumbItem>{index<items.length-1&&<BreadcrumbSeparator/>}</span>)}</BreadcrumbList></Breadcrumb></div><pre className="overflow-auto rounded-xl bg-muted p-4 text-xs">{JSON.stringify(items,null,2)}</pre></CardContent></Card>
  <p className="text-xs text-muted-foreground">This lab does not change application routing, browser history, permissions, or remote state.</p>
 </div></main>;
}
