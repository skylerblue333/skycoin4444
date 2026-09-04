import { BookOpen, Gamepad2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const sections=[
 {id:"learn",title:"Learning",icon:BookOpen,detail:"SkySchool lessons, quizzes, and progress evidence."},
 {id:"play",title:"Gaming",icon:Gamepad2,detail:"Deterministic local arcade and interaction labs."},
 {id:"safety",title:"Safety",icon:ShieldCheck,detail:"Privacy controls, activity evidence, and explicit beta boundaries."},
] as const;

export default function AccordionNavigation(){
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-3xl space-y-6">
  <header><Badge variant="outline">Navigation interaction lab</Badge><h1 className="mt-3 text-3xl font-bold">Accordion navigation</h1><p className="mt-2 text-muted-foreground">Explore grouped beta-area descriptions using the shared accordion component.</p></header>
  <Card><CardHeader><CardTitle>Beta areas</CardTitle><CardDescription>Opening a section changes only local component state.</CardDescription></CardHeader><CardContent><Accordion type="single" collapsible>{sections.map(section=>{const Icon=section.icon;return <AccordionItem key={section.id} value={section.id}><AccordionTrigger><span className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary"/>{section.title}</span></AccordionTrigger><AccordionContent>{section.detail}</AccordionContent></AccordionItem>})}</Accordion></CardContent></Card>
  <p className="text-xs text-muted-foreground">This lab does not change routes, permissions, account state, or remote navigation configuration.</p>
 </div></main>;
}
