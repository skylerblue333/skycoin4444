import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsNavigation(){
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-3xl space-y-6">
  <header><Badge variant="outline">Tabs interaction lab</Badge><h1 className="mt-3 text-3xl font-bold">Tabs navigation</h1><p className="mt-2 text-muted-foreground">Switch between local content panels using the shared tabs component.</p></header>
  <Card><CardHeader><CardTitle>Beta orientation</CardTitle><CardDescription>Tab changes are local UI state, not route changes.</CardDescription></CardHeader><CardContent><Tabs defaultValue="build"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="build">Build</TabsTrigger><TabsTrigger value="test">Test</TabsTrigger><TabsTrigger value="limits">Limits</TabsTrigger></TabsList><TabsContent value="build" className="mt-4 rounded-xl border p-4 text-sm">Implement meaningful deterministic behavior rather than generated shells.</TabsContent><TabsContent value="test" className="mt-4 rounded-xl border p-4 text-sm">Use exact-head CI, release regression tests, and smoke coverage before promotion.</TabsContent><TabsContent value="limits" className="mt-4 rounded-xl border p-4 text-sm">Do not claim providers, payments, custody, deployment, or certification without evidence.</TabsContent></Tabs></CardContent></Card>
  <p className="text-xs text-muted-foreground">This lab does not alter browser history, application routes, account state, or remote configuration.</p>
 </div></main>;
}
