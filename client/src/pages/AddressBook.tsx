import { FormEvent, useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserPlus } from "lucide-react";
import { validateLocalContact, type LocalContact } from "@/lib/betaUtilityLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const KEY="skycoin4444-beta-address-book-v1";
function load():LocalContact[]{try{const v=JSON.parse(localStorage.getItem(KEY)??"[]");return Array.isArray(v)?v:[]}catch{return[]}}

export default function AddressBook(){
  const [contacts,setContacts]=useState<LocalContact[]>(load); const [query,setQuery]=useState(""); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState(""); const [note,setNote]=useState(""); const [error,setError]=useState("");
  useEffect(()=>localStorage.setItem(KEY,JSON.stringify(contacts)),[contacts]);
  const shown=useMemo(()=>contacts.filter(c=>[c.name,c.email,c.phone,c.note].some(v=>v.toLowerCase().includes(query.toLowerCase().trim()))),[contacts,query]);
  const submit=(e:FormEvent)=>{e.preventDefault();const draft={name,email,phone,note};const errors=validateLocalContact(draft);if(errors.length){setError(errors.join(". "));return;}setContacts(v=>[{id:crypto.randomUUID(),...draft},...v]);setName("");setEmail("");setPhone("");setNote("");setError("");};
  return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-5xl space-y-6">
    <header><Badge variant="outline">Browser-local contacts</Badge><h1 className="mt-3 text-3xl font-bold">Address book</h1><p className="mt-2 text-muted-foreground">Keep a small local contact list for beta planning.</p></header>
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><Card><CardHeader><UserPlus className="h-5 w-5 text-primary"/><CardTitle className="mt-2">Add contact</CardTitle><CardDescription>No contact is uploaded.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-3"><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/><Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone"/><Textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Note"/><Button type="submit">Save locally</Button>{error&&<p className="text-sm text-destructive">{error}</p>}</form></CardContent></Card>
    <Card><CardHeader><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search contacts"/></div></CardHeader><CardContent className="space-y-3">{shown.length===0?<p className="py-8 text-center text-sm text-muted-foreground">No matching contacts.</p>:shown.map(c=><div key={c.id} className="rounded-xl border p-4"><div className="flex justify-between gap-3"><div><p className="font-medium">{c.name}</p><p className="text-sm text-muted-foreground">{c.email||"No email"} · {c.phone||"No phone"}</p>{c.note&&<p className="mt-2 text-sm">{c.note}</p>}</div><Button size="icon" variant="ghost" onClick={()=>setContacts(v=>v.filter(x=>x.id!==c.id))}><Trash2 className="h-4 w-4"/></Button></div></div>)}</CardContent></Card></div>
    <p className="text-xs text-muted-foreground">No address lookup, messaging, CRM sync, device-contact sync, or server persistence is provided.</p>
  </div></main>;
}
