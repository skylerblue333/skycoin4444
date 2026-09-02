/*
 * Truthful onboarding for the engineering beta: real OAuth entry, clear
 * capability boundaries, and direct handoff to working product surfaces.
 */
import { Link } from "wouter";
import { BookOpen, MessageSquare, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NEXT_STEPS = [
  { title: "Learn", detail: "Start a real SkySchool lesson and record progress.", href: "/course-catalog", icon: BookOpen },
  { title: "Connect", detail: "Join a public community and publish a thread.", href: "/community-hub", icon: Users },
  { title: "Share", detail: "Post a build note or reply to a real update.", href: "/activity-feed", icon: MessageSquare },
] as const;

export function SignUpFlow() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <main className="flex min-h-screen items-center justify-center p-6">Loading account state…</main>;

  if (isAuthenticated && user) return <main className="min-h-screen bg-background p-4 md:p-10"><div className="mx-auto max-w-4xl space-y-8"><header><Badge variant="outline" className="mb-3">Account ready</Badge><h1 className="text-4xl font-black tracking-tight">Choose your first beta route</h1><p className="mt-3 text-muted-foreground">You are signed in as {user.name || user.username || "a Skycoin member"}. Start with a workflow that is implemented and testable today.</p></header><div className="grid gap-5 md:grid-cols-3">{NEXT_STEPS.map(({ title, detail, href, icon: Icon }) => <Link key={title} href={href} className="group"><Card className="h-full transition-colors group-hover:border-primary"><CardHeader><Icon className="h-6 w-6 text-primary" /><CardTitle>{title}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardContent><span className="text-sm font-semibold text-primary">Open route →</span></CardContent></Card></Link>)}</div><Link href="/profile"><Button variant="outline">Manage profile and privacy</Button></Link></div></main>;

  return <main className="min-h-screen bg-background p-4 md:p-10"><div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center"><section><Badge variant="outline" className="mb-4">Invitation-only engineering beta</Badge><h1 className="text-4xl font-black tracking-tight sm:text-6xl">Build with evidence, not hype.</h1><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Skycoin4444 is opening a controlled product beta around learning, community, feedback, and read-only Web3 inspection. Sign in to test the workflows that are actually connected.</p><Button className="mt-7" onClick={() => startLogin()}>Sign in with Skycoin identity</Button></section><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />What to expect</CardTitle><CardDescription>No invented reviews, bonuses, balances, user counts, or scarcity claims.</CardDescription></CardHeader><CardContent className="space-y-4 text-sm leading-6 text-muted-foreground"><p>Your account controls your profile, privacy settings, learning progress, community participation, and social posts.</p><p>Payments, custody, wallet signing, live settlement, and production chain execution are intentionally unavailable until independently verified.</p><Link href="/beta-catalog" className="font-semibold text-primary">Read the beta catalog →</Link></CardContent></Card></div></main>;
}
