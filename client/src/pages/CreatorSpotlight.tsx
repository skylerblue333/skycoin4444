import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Award, CheckCircle2, Crown, Search, Star, TrendingUp, Users, Zap } from "lucide-react";

const PREVIEW_CREATORS = [
  { id: "c1", name: "SkylerDev", handle: "@skylerdev", avatar: "S", tier: "Legendary", bio: "Web3, AI, and platform development preview profile.", categories: ["Tech", "Crypto", "AI"], verified: true, gradient: "from-purple-600 to-pink-600" },
  { id: "c2", name: "CryptoQueen", handle: "@cryptoqueen", avatar: "C", tier: "Elite", bio: "DeFi and digital-assets preview profile.", categories: ["DeFi", "NFTs", "Trading"], verified: true, gradient: "from-blue-600 to-cyan-600" },
  { id: "c3", name: "NeonStreamer", handle: "@neonstreamer", avatar: "N", tier: "Pro", bio: "Gaming and livestreaming preview profile.", categories: ["Gaming", "Streaming"], verified: true, gradient: "from-green-600 to-teal-600" },
  { id: "c4", name: "AIArtist", handle: "@aiartist", avatar: "A", tier: "Rising", bio: "Generative-art preview profile.", categories: ["Art", "AI"], verified: false, gradient: "from-orange-600 to-red-600" },
];

const TIER_CONFIG = {
  Legendary: { color: "text-yellow-400 border-yellow-500/30", icon: Crown },
  Elite: { color: "text-purple-400 border-purple-500/30", icon: Star },
  Pro: { color: "text-blue-400 border-blue-500/30", icon: Award },
  Rising: { color: "text-green-400 border-green-500/30", icon: TrendingUp },
} as const;

function CreatorCard({ creator }: { creator: (typeof PREVIEW_CREATORS)[number] }) {
  const { isAuthenticated } = useAuth();
  const tier = TIER_CONFIG[creator.tier];
  const TierIcon = tier.icon;

  const unavailable = (action: string) => {
    if (!isAuthenticated) {
      toast.error("Sign in first");
      return;
    }
    toast.info(`${action} is not connected to a verified creator backend yet.`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className={`h-24 bg-gradient-to-br ${creator.gradient}`} />
      <div className="px-4 pb-4">
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <Avatar className="h-16 w-16 border-4 border-card">
            <AvatarFallback className={`bg-gradient-to-br ${creator.gradient} text-xl font-bold text-white`}>{creator.avatar}</AvatarFallback>
          </Avatar>
          <Badge variant="outline" className={tier.color}><TierIcon className="mr-1 h-3 w-3" />{creator.tier}</Badge>
        </div>
        <div className="mb-3">
          <div className="flex items-center gap-1.5"><h3 className="font-bold">{creator.name}</h3>{creator.verified ? <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> : null}</div>
          <p className="text-xs text-muted-foreground">{creator.handle}</p>
          <p className="mt-2 text-xs text-muted-foreground">{creator.bio}</p>
        </div>
        <div className="mb-4 flex flex-wrap gap-1">{creator.categories.map(category => <Badge key={category} variant="secondary" className="text-[10px]">{category}</Badge>)}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => unavailable("Follow")}>Follow</Button>
          <Button size="sm" className="flex-1" onClick={() => unavailable("Subscribe")}>Subscribe</Button>
        </div>
      </div>
    </div>
  );
}

export default function CreatorSpotlight() {
  const [search, setSearch] = useState("");
  const filtered = PREVIEW_CREATORS.filter(creator => creator.name.toLowerCase().includes(search.toLowerCase()) || creator.handle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><Crown className="h-6 w-6 text-yellow-400" /><h1 className="text-2xl font-bold">Creator Spotlight</h1></div>
          <p className="mt-1 text-sm text-muted-foreground">Creator discovery preview. Counts, earnings, subscriptions, and live status are not shown until backed by verified data.</p>
        </div>
        <Link href="/creator-onboarding"><Button className="gap-2"><Zap className="h-4 w-4" />Creator Onboarding</Button></Link>
      </div>

      <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
        Preview data only — follow and subscription writes are intentionally unavailable until the creator backend is implemented.
      </div>

      <div className="relative mb-5 max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search preview creators..." className="pl-9" /></div>

      {filtered.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(creator => <CreatorCard key={creator.id} creator={creator} />)}</div>
      ) : (
        <div className="py-16 text-center"><Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" /><p className="text-muted-foreground">No preview creators match your search.</p></div>
      )}
    </div>
  );
}
