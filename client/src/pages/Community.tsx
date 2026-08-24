import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, Lock, Search, Shield, Users, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const PREVIEW_COMMUNITIES = [
  { id: 1, name: "SKYCOIN4444 Official", category: "Official", description: "Main ecosystem community preview", tokenGated: false },
  { id: 2, name: "Creator Guild", category: "Creators", description: "Creator community preview", tokenGated: true },
  { id: 3, name: "GameFi Arena", category: "Gaming", description: "Gaming community preview", tokenGated: false },
  { id: 4, name: "Developer Hub", category: "Development", description: "Developer community preview", tokenGated: false },
];

const PREVIEW_CHANNELS = [
  { name: "general", type: "text" },
  { name: "announcements", type: "text" },
  { name: "creator-showcase", type: "text" },
  { name: "voice-lounge", type: "voice" },
];

const PREVIEW_ROLES = [
  { name: "Admin", permissions: "Community administration" },
  { name: "Moderator", permissions: "Moderation tools" },
  { name: "Creator", permissions: "Creator channels" },
  { name: "Member", permissions: "Standard community access" },
];

export default function Community() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = PREVIEW_COMMUNITIES.filter(community => community.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const unavailable = (action: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    toast.info(`${action} is not connected to a verified community backend yet.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-3xl font-bold">Communities</h1><p className="mt-1 text-sm text-muted-foreground">Community-system preview for servers, channels, roles, and gated access.</p></div>
          <Button onClick={() => unavailable("Community creation")}>{isAuthenticated ? "Create Community" : "Sign In"}</Button>
        </div>

        <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
          Preview data only. Member counts, token gating, joins, messages, and voice rooms are not reported as live until their backend services are implemented and verified.
        </div>

        <Tabs defaultValue="browse">
          <TabsList><TabsTrigger value="browse"><Users className="mr-1 h-3.5 w-3.5" />Browse</TabsTrigger><TabsTrigger value="channels"><Hash className="mr-1 h-3.5 w-3.5" />Channels</TabsTrigger><TabsTrigger value="roles"><Shield className="mr-1 h-3.5 w-3.5" />Roles</TabsTrigger></TabsList>

          <TabsContent value="browse" className="mt-4 space-y-4">
            <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search preview communities..." className="pl-9" /></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(community => (
                <Card key={community.id} className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-2"><h2 className="font-semibold">{community.name}</h2>{community.tokenGated ? <Lock className="h-4 w-4 text-amber-400" /> : null}</div>
                  <p className="mb-3 text-sm text-muted-foreground">{community.description}</p>
                  <div className="flex items-center justify-between"><Badge variant="secondary">{community.category}</Badge><Button size="sm" variant="outline" onClick={() => unavailable("Join community")}>Join</Button></div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="channels" className="mt-4"><Card className="divide-y divide-border/50">{PREVIEW_CHANNELS.map(channel => <div key={channel.name} className="flex items-center gap-3 p-4">{channel.type === "voice" ? <Volume2 className="h-4 w-4 text-purple-400" /> : <Hash className="h-4 w-4 text-muted-foreground" />}<span>{channel.name}</span><Badge variant="outline" className="ml-auto">Preview {channel.type}</Badge></div>)}</Card></TabsContent>

          <TabsContent value="roles" className="mt-4"><Card className="divide-y divide-border/50">{PREVIEW_ROLES.map(role => <div key={role.name} className="p-4"><div className="font-medium">{role.name}</div><div className="text-sm text-muted-foreground">{role.permissions}</div></div>)}</Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
