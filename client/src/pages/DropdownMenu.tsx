import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu as Menu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function DropdownMenu(){
 const [lastAction,setLastAction]=useState("None");
 const choose=(label:string)=>setLastAction(label);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Menu interaction lab</Badge><h1 className="mt-3 text-3xl font-bold">Dropdown menu</h1><p className="mt-2 text-muted-foreground">Exercise keyboard/click menu actions with local state only.</p></header>
  <Card><CardHeader><CardTitle>Demo actions</CardTitle><CardDescription>Selected actions are recorded only in this page state.</CardDescription></CardHeader><CardContent className="space-y-4"><Menu><DropdownMenuTrigger asChild><Button variant="outline">Open menu<MoreHorizontal className="ml-2 h-4 w-4"/></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>Local actions</DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuItem onSelect={()=>choose("Inspect")}>Inspect</DropdownMenuItem><DropdownMenuItem onSelect={()=>choose("Duplicate")}>Duplicate</DropdownMenuItem><DropdownMenuItem onSelect={()=>choose("Archive rehearsal")}>Archive rehearsal</DropdownMenuItem></DropdownMenuContent></Menu><div className="rounded-xl border p-4 text-sm">Last local action: <strong>{lastAction}</strong></div></CardContent></Card>
  <p className="text-xs text-muted-foreground">No file, account, archive, delete, permission, or server action is actually performed.</p>
 </div></main>;
}
