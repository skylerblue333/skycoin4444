import { AlertCircle, ArrowRight, BookOpen, Gamepad2, Home, Radio, Search, Users } from "lucide-react";
import { useLocation } from "wouter";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutonomousAgentWallets, ProvablyFairGaming, SkySchoolCredentialing, ZKMLVerificationCenter } from "./IntegrationGapPages";

const integrationRoutes: Record<string, () => ReactNode> = {
  "/agent-wallets": AutonomousAgentWallets,
  "/zkml-verification": ZKMLVerificationCenter,
  "/provably-fair-gaming": ProvablyFairGaming,
  "/skyschool-credentialing": SkySchoolCredentialing,
};

const recoveryAreas = [
  { href: "/", label: "Home", detail: "Open the product launchpad.", icon: Home },
  { href: "/gaming", label: "Gaming", detail: "Recover the Arcade and game paths.", icon: Gamepad2 },
  { href: "/course-catalog", label: "Learn", detail: "Recover courses and lesson progress.", icon: BookOpen },
  { href: "/live", label: "Live", detail: "Open creator rooms and real-time chat.", icon: Radio },
  { href: "/activity-feed", label: "Social", detail: "Return to the community feed.", icon: Users },
];

export default function NotFound() {
  const [location, setLocation] = useLocation();
  const IntegrationScreen = integrationRoutes[location];
  if (IntegrationScreen) return <>{IntegrationScreen()}</>;
  return (
    <main className="min-h-screen bg-[#050510] px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Card className="border-white/10 bg-white/[0.04] text-white">
          <CardHeader className="pb-4"><div className="flex items-start gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300/10 text-amber-200"><AlertCircle className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/70">Route recovery</p><CardTitle className="mt-2 text-3xl">That screen is not available here</CardTitle><p className="mt-2 text-sm leading-6 text-white/50">The route may have moved, but your core product areas are still one click away. Nothing was deleted.</p></div></div></CardHeader>
          <CardContent><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs font-bold uppercase tracking-wide text-white/30">Requested path</p><p className="mt-1 break-all font-mono text-sm text-white/60">{location}</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recoveryAreas.map(({ href, label, detail, icon: Icon }) => <button key={href} type="button" onClick={() => setLocation(href)} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/[0.06]"><Icon className="h-5 w-5 text-sky-200" /><p className="mt-4 font-bold">{label}</p><p className="mt-1 text-xs leading-5 text-white/40">{detail}</p><span className="mt-3 inline-flex items-center text-xs font-bold text-sky-200">Open <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" /></span></button>)}</div><div className="mt-6 flex flex-wrap gap-2"><Button onClick={() => setLocation("/advanced-search")} variant="outline" className="border-white/15 bg-white/[0.03] text-white"><Search className="mr-2 h-4 w-4" />Search all areas</Button><Button onClick={() => setLocation("/")} className="bg-white text-[#050510] hover:bg-white/90"><Home className="mr-2 h-4 w-4" />Go home</Button></div></CardContent>
        </Card>
      </div>
    </main>
  );
}
