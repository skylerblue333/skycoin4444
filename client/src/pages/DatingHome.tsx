import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Brain, CheckCircle2, ChevronRight, Crown, Heart, MapPin, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Star, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const SAMPLE_PROFILES = [
  { id: 1, name: "Alex Rivera", age: 26, location: "San Francisco, CA", bio: "Crypto trader by day, DJ by night. Looking for someone who gets both worlds.", interests: ["Web3", "Music", "Travel", "DeFi"], compatibility: 94, trustScore: 87, verified: true, intent: "Serious", gradient: "from-fuchsia-500 via-pink-500 to-orange-300", aiSummary: "Preview analysis: shared interests and communication preferences indicate a potentially strong match." },
  { id: 2, name: "Jordan Kim", age: 29, location: "New York, NY", bio: "AI researcher building the future. Passionate about ethics and good coffee.", interests: ["AI", "Philosophy", "Coffee", "Running"], compatibility: 88, trustScore: 92, verified: true, intent: "Networking", gradient: "from-violet-500 via-indigo-500 to-sky-400", aiSummary: "Preview analysis: strong overlap in intellectual interests and preference for deeper conversation." },
  { id: 3, name: "Sam Chen", age: 24, location: "Austin, TX", bio: "Startup founder, amateur chef, and professional overthinker.", interests: ["Startups", "Cooking", "Gaming", "Hiking"], compatibility: 82, trustScore: 79, verified: false, intent: "Casual", gradient: "from-emerald-400 via-cyan-500 to-blue-500", aiSummary: "Preview analysis: creative interests and entrepreneurial themes provide useful conversation starters." },
] as const;

type DiscoveryItem = { icon: LucideIcon; label: string; value: string };

export default function DatingHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const profile = SAMPLE_PROFILES[currentIndex];
  const discoveryItems: DiscoveryItem[] = [
    { icon: Sparkles, label: "Suggested", value: `${SAMPLE_PROFILES.length} preview` },
    { icon: Heart, label: "Liked", value: String(likedIds.length) },
    { icon: MessageCircle, label: "Matches", value: "Not connected" },
    { icon: ShieldCheck, label: "Safety", value: "Review tools" },
  ];

  const advance = () => {
    setShowAnalysis(false);
    setCurrentIndex((value) => Math.min(value + 1, SAMPLE_PROFILES.length));
  };

  const like = () => {
    if (!profile) return;
    setLikedIds((ids) => (ids.includes(profile.id) ? ids : [...ids, profile.id]));
    toast.success(`${profile.name} added to your preview likes.`);
    advance();
  };

  const reset = () => {
    setCurrentIndex(0);
    setLikedIds([]);
    setShowAnalysis(false);
  };

  return (
    <ExperienceShell title="SkyLife Dating" subtitle="Discover compatible connections with transparent preview states." icon={Heart} accent="pink" badge="UI preview" actions={<Link href="/dating-matches"><Button variant="outline" className="rounded-xl border-slate-200 bg-white"><MessageCircle className="mr-2 h-4 w-4" /> Matches</Button></Link>}>
      <div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
        <SurfaceCard className="h-fit p-3">
          <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Discover</p>
          {discoveryItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-pink-50 text-pink-600"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-slate-800">{label}</div><div className="truncate text-xs text-slate-400">{value}</div></div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          ))}
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">Profiles on this screen are sample fixtures for interface validation, not live members.</div>
        </SurfaceCard>

        <div className="min-w-0">
          {profile ? (
            <SurfaceCard className="overflow-hidden">
              <div className={`relative min-h-[420px] bg-gradient-to-br ${profile.gradient} p-6 md:min-h-[520px]`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.28),transparent_45%)]" />
                <div className="relative flex h-full min-h-[370px] flex-col justify-between md:min-h-[468px]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2"><span className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Sample profile</span>{profile.verified ? <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700"><CheckCircle2 className="h-3.5 w-3.5" /> Preview verified</span> : null}</div>
                    <span className="rounded-full bg-black/35 px-3 py-1 text-sm font-bold text-white backdrop-blur">{profile.compatibility}% match</span>
                  </div>
                  <div className="mx-auto grid h-36 w-36 place-items-center rounded-full border-4 border-white/60 bg-white/20 text-6xl font-black text-white shadow-2xl backdrop-blur-sm md:h-44 md:w-44">{profile.name.charAt(0)}</div>
                  <div className="rounded-2xl bg-slate-950/50 p-5 text-white backdrop-blur-md">
                    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-3xl font-black tracking-tight">{profile.name}, {profile.age}</h2><p className="mt-1 flex items-center gap-1 text-sm text-white/75"><MapPin className="h-4 w-4" /> {profile.location}</p></div><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{profile.intent}</span></div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">{profile.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{profile.interests.map((interest) => <span key={interest} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{interest}</span>)}</div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 border-t border-slate-100 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <button type="button" onClick={() => setShowAnalysis((value) => !value)} className="flex items-center gap-2 text-left text-sm font-semibold text-violet-700 hover:text-violet-900"><Brain className="h-4 w-4" /> {showAnalysis ? "Hide" : "Show"} compatibility preview<ChevronRight className={`h-4 w-4 transition-transform ${showAnalysis ? "rotate-90" : ""}`} /></button>
                <div className="text-xs text-slate-400">Trust fixture: {profile.trustScore}/100</div>
                {showAnalysis ? <div className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-sm leading-6 text-violet-800 md:col-span-2">{profile.aiSummary}</div> : null}
              </div>
            </SurfaceCard>
          ) : (
            <SurfaceCard className="grid min-h-[520px] place-items-center p-8 text-center"><div><Heart className="mx-auto h-12 w-12 text-pink-200" /><h2 className="mt-4 text-xl font-bold">Preview complete</h2><p className="mt-2 text-sm text-slate-500">You reached the end of the sample profile set.</p><Button onClick={reset} className="mt-5 rounded-xl bg-pink-600 hover:bg-pink-700"><RotateCcw className="mr-2 h-4 w-4" /> Restart preview</Button></div></SurfaceCard>
          )}
          {profile ? <div className="mt-5 flex items-center justify-center gap-4" aria-label="Profile actions"><Button aria-label="Pass profile" onClick={advance} variant="outline" className="h-14 w-14 rounded-full border-2 border-slate-200 bg-white p-0 shadow-sm"><X className="h-6 w-6 text-slate-500" /></Button><Button aria-label="Super like preview" onClick={() => toast("Premium action is not connected in this engineering preview.")} variant="outline" className="h-12 w-12 rounded-full border-2 border-amber-200 bg-white p-0 shadow-sm"><Star className="h-5 w-5 text-amber-500" /></Button><Button aria-label="Like profile" onClick={like} className="h-14 w-14 rounded-full bg-pink-600 p-0 shadow-lg shadow-pink-200 hover:bg-pink-700"><Heart className="h-6 w-6 fill-current" /></Button></div> : null}
        </div>

        <div className="space-y-5">
          <SurfaceCard className="p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Profile readiness</h2><span className="text-xs font-semibold text-emerald-600">Preview</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-3/4 rounded-full bg-emerald-500" /></div><div className="mt-4 space-y-3 text-sm text-slate-600">{["Add clear photos", "Write a useful bio", "Set matching intent", "Review privacy settings"].map((item, index) => <div key={item} className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 ${index < 3 ? "text-emerald-500" : "text-slate-300"}`} /> {item}</div>)}</div></SurfaceCard>
          <SurfaceCard className="overflow-hidden p-5"><div className="flex items-center gap-2 text-pink-700"><Zap className="h-5 w-5" /><h2 className="font-bold">Visibility tools</h2></div><p className="mt-2 text-sm leading-6 text-slate-500">Boost and premium controls are presentation-only until billing and entitlement services are connected and verified.</p><Button onClick={() => toast("Boost is unavailable in this engineering preview.")} variant="outline" className="mt-4 w-full rounded-xl border-pink-200 text-pink-700 hover:bg-pink-50"><Zap className="mr-2 h-4 w-4" /> Preview boost</Button></SurfaceCard>
          <SurfaceCard className="p-5"><div className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" /><h2 className="font-bold">Premium experience</h2></div><p className="mt-2 text-sm leading-6 text-slate-500">See how premium benefits can be presented without implying an active subscription product.</p><Link href="/dating-premium"><Button variant="ghost" className="mt-2 w-full justify-between rounded-xl text-slate-700">Open premium preview <ChevronRight className="h-4 w-4" /></Button></Link></SurfaceCard>
        </div>
      </div>
    </ExperienceShell>
  );
}
