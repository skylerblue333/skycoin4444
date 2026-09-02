/*
 * Product launchpad: evidence-led Skycoin4444 beta navigation. Link only to
 * working or explicitly controlled surfaces; never imply unavailable providers.
 */
import { ArrowRight, BookOpen, Boxes, LayoutDashboard, MessageSquare, Radio, ShieldCheck, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WORKING_SURFACES = [
  { title: "SkySchool", description: "Authored lessons with deterministic assessment and account-scoped progress.", href: "/course-catalog", status: "Working beta", icon: BookOpen },
  { title: "Activity Feed", description: "Real posts, reactions, comments, and authenticated replies from the database.", href: "/activity-feed", status: "Working beta", icon: Radio },
  { title: "Community Hub", description: "Browse public communities, join spaces, and publish discussion threads.", href: "/community-hub", status: "Working beta", icon: Users },
  { title: "Web3 Evidence Room", description: "Inspect local and testnet fixtures without wallet, custody, or chain writes.", href: "/beta-web3", status: "Controlled test", icon: Boxes },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl"><Badge variant="outline" className="mb-4">Skycoin4444 engineering beta</Badge><h1 className="text-4xl font-black tracking-tight sm:text-6xl">A real product surface, built in public.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Start with the journeys that are implemented and testable today. Every surface is labeled by its evidence level; unfinished financial, custody, and production-chain actions remain unavailable.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/beta-workspace"><Button><LayoutDashboard className="mr-2 h-4 w-4" />Open beta workspace</Button></Link><Link href="/beta-catalog"><Button variant="outline">View beta catalog <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/beta-feedback"><Button variant="outline">Send beta feedback</Button></Link></div>
        </header>

        <section className="py-10"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Available now</p><h2 className="mt-2 text-2xl font-bold">Use the working product</h2></div><p className="hidden max-w-sm text-right text-sm text-muted-foreground sm:block">No invented users, balances, reviews, or transaction volume.</p></div><div className="grid gap-5 md:grid-cols-2">{WORKING_SURFACES.map(({ title, description, href, status, icon: Icon }) => <Link key={title} href={href} className="group"><Card className="h-full transition-colors group-hover:border-primary"><CardHeader><div className="flex items-start justify-between gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><Badge variant={status === "Controlled test" ? "outline" : "default"}>{status}</Badge></div><CardTitle className="mt-2">{title}</CardTitle><CardDescription className="leading-6">{description}</CardDescription></CardHeader><CardContent><span className="inline-flex items-center text-sm font-semibold text-primary">Open surface <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span></CardContent></Card></Link>)}</div></section>

        <section className="grid gap-5 border-t py-10 md:grid-cols-3"><Card><CardHeader><ShieldCheck className="h-5 w-5 text-primary" /><CardTitle className="text-base">Truthful by default</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">Pages show live records or explicit controlled fixtures. Empty states are real empty states, not fabricated activity.</CardContent></Card><Card><CardHeader><MessageSquare className="h-5 w-5 text-primary" /><CardTitle className="text-base">Feedback has a path</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">Use the beta feedback surface to report bugs, content issues, privacy concerns, or evidence gaps.</CardContent></Card><Card><CardHeader><Boxes className="h-5 w-5 text-primary" /><CardTitle className="text-base">High-risk actions gated</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">Payments, custody, live settlement, and production chain execution are not enabled by visual polish alone.</CardContent></Card></section>
      </div>
    </main>
  );
}
