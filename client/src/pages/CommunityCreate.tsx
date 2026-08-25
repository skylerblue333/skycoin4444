import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Users, Lock, Globe, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

const CATEGORIES = ["Crypto", "AI", "Dev", "DeFi", "Creator", "Gaming", "NFT", "Trading", "Charity", "Community", "Other"];

const COMMUNITY_TYPES = [
  { id: "public" as const, label: "Public", icon: Globe, desc: "Anyone can discover and join" },
  { id: "private" as const, label: "Private", icon: Lock, desc: "Hidden from the public directory until membership approval is implemented" },
];

export default function CommunityCreate() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [category, setCategory] = useState("Community");

  const createMutation = trpc.community.create.useMutation({
    onSuccess: () => {
      toast.success("Community created");
      navigate("/community");
    },
    onError: (err) => toast.error(err.message || "Failed to create community"),
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Sign in to create a community</h2>
        <p className="text-muted-foreground mb-6">Build your own space in the SKYCOIN4444 ecosystem.</p>
        <a href={getLoginUrl()}><Button className="btn-primary">Sign In</Button></a>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Community name is required");
      return;
    }
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || null,
      visibility,
      category,
    });
  };

  return (
    <div className="container py-8 max-w-2xl animate-page-in">
      <PageHeader backHref="/community" icon={Users} title="Create Community" subtitle="Build a persisted community space" />

      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Community Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SKY444 Traders" maxLength={120} />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this community about?" className="min-h-[80px] resize-none" maxLength={255} />
            <div className="text-xs text-muted-foreground text-right mt-1">{description.length}/255</div>
          </div>
        </Card>

        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
                {cat}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block">Visibility</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMUNITY_TYPES.map(option => {
              const Icon = option.icon;
              return (
                <button key={option.id} onClick={() => setVisibility(option.id)} className={`p-4 rounded-xl text-left border transition-all ${visibility === option.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-primary/5"}`}>
                  <Icon className={`w-5 h-5 mb-2 ${visibility === option.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{option.desc}</div>
                </button>
              );
            })}
          </div>
        </Card>

        <Button onClick={handleSubmit} disabled={createMutation.isPending || !name.trim()} className="w-full btn-primary h-12 text-base">
          {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating…</> : <><Users className="w-4 h-4 mr-2" />Create Community</>}
        </Button>
      </div>
    </div>
  );
}
