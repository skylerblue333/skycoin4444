import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { confirmationMatches } from "@/lib/betaUtilityLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PHRASE="CONFIRM BETA ACTION";
export default function ConfirmationDialog(){
 const [typed,setTyped]=useState(""); const [confirmed,setConfirmed]=useState(false); const valid=confirmationMatches(typed,PHRASE);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-2xl space-y-6">
  <header><Badge variant="outline">Safe interaction demo</Badge><h1 className="mt-3 text-3xl font-bold">Confirmation dialog</h1><p className="mt-2 text-muted-foreground">Test a typed-confirmation pattern without performing any destructive backend action.</p></header>
  <Card><CardHeader><AlertTriangle className="h-5 w-5 text-amber-600"/><CardTitle className="mt-2">Destructive-action rehearsal</CardTitle><CardDescription>The demo records confirmation state only in React memory.</CardDescription></CardHeader><CardContent className="space-y-4">
    <Dialog><DialogTrigger asChild><Button variant="destructive">Open confirmation</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Confirm demo action</DialogTitle><DialogDescription>Type {PHRASE} exactly. Nothing will be deleted or sent.</DialogDescription></DialogHeader><Input value={typed} onChange={e=>setTyped(e.target.value)} placeholder={PHRASE}/><DialogFooter><Button disabled={!valid} onClick={()=>setConfirmed(true)}>Confirm demo</Button></DialogFooter></DialogContent></Dialog>
    {confirmed&&<div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 p-4 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-600"/>Confirmation pattern completed locally.</div>}
  </CardContent></Card>
  <p className="text-xs text-muted-foreground">No account deletion, purchase, payment, server mutation, or irreversible operation is connected to this demo.</p>
 </div></main>;
}
