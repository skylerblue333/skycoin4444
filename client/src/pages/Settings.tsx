import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, Bell, Lock, Shield, UserRound, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function UnavailableSetting({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-4">
      <div><p className="font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div>
      <Badge variant="outline">Not connected</Badge>
    </div>
  );
}

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const profileQuery = trpc.user.profile.useQuery(
    { userId: user?.id ?? "" },
    { enabled: Boolean(user?.id) }
  );
  const utils = trpc.useUtils();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: async () => {
      toast.success("Profile saved");
      await profileQuery.refetch();
      await utils.auth.me.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    setDisplayName(profileQuery.data.name ?? "");
    setUsername(profileQuery.data.username ?? "");
    setBio(profileQuery.data.bio ?? "");
  }, [profileQuery.data]);

  const saveProfile = () => {
    updateProfile.mutate({
      displayName: displayName.trim() || undefined,
      username: username.trim() || undefined,
      bio: bio.trim() || null,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-1 text-muted-foreground">Verified account state and configuration availability</p>
        </div>

        {!isAuthenticated ? (
          <Card><CardHeader><CardTitle>Sign in required</CardTitle><CardDescription>Account settings are available after authentication.</CardDescription></CardHeader></Card>
        ) : (
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="flex h-auto flex-wrap"><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="privacy">Privacy</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="wallet">Wallet</TabsTrigger></TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" />SkyProfile</CardTitle><CardDescription>Profile fields are stored in the users table. Unsupported progression metrics are not simulated.</CardDescription></CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{profileQuery.data?.email || user?.email || "Not provided"}</p></div>
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Followers</p><p className="font-medium">{profileQuery.data?.followerCount ?? "—"}</p></div>
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Level / XP</p><p className="font-medium">Not represented in current schema</p></div>
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Reputation</p><p className="font-medium">Not represented in current schema</p></div>
                  </div>

                  <div className="grid gap-4">
                    <div><label className="text-sm font-medium" htmlFor="profile-name">Display name</label><Input id="profile-name" className="mt-1" value={displayName} onChange={event => setDisplayName(event.target.value)} maxLength={255} /></div>
                    <div><label className="text-sm font-medium" htmlFor="profile-username">Username</label><Input id="profile-username" className="mt-1" value={username} onChange={event => setUsername(event.target.value)} maxLength={64} placeholder="letters, numbers, _, ., -" /></div>
                    <div><label className="text-sm font-medium" htmlFor="profile-bio">Bio</label><Textarea id="profile-bio" className="mt-1" value={bio} onChange={event => setBio(event.target.value)} maxLength={255} rows={4} /></div>
                  </div>

                  {profileQuery.error ? <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{profileQuery.error.message}</div> : null}
                  <div className="flex flex-wrap gap-2"><Button onClick={saveProfile} disabled={updateProfile.isPending || profileQuery.isLoading}>{updateProfile.isPending ? "Saving…" : "Save Profile"}</Button><Button variant="outline" onClick={() => void logout()}>Sign Out</Button></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification preferences</CardTitle></CardHeader><CardContent className="space-y-3"><UnavailableSetting title="Tip notifications" description="Preference persistence is not implemented." /><UnavailableSetting title="Follow notifications" description="Preference persistence is not implemented." /><UnavailableSetting title="Message notifications" description="Preference persistence is not implemented." /></CardContent></Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Privacy</CardTitle></CardHeader><CardContent className="space-y-3"><UnavailableSetting title="Privacy mode" description="No server-side privacy preference contract is verified yet." /><UnavailableSetting title="Online status" description="Presence preference persistence is not implemented." /><UnavailableSetting title="Direct-message permissions" description="DM permission persistence is not implemented." /></CardContent></Card>
            </TabsContent>

            <TabsContent value="security">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Security</CardTitle><CardDescription>Authentication is handled by the configured OAuth/session system.</CardDescription></CardHeader><CardContent className="space-y-3"><UnavailableSetting title="Two-factor authentication" description="No 2FA enrollment backend is wired to this screen." /><UnavailableSetting title="Session management" description="The application does not yet expose a verified list/revoke-sessions API." /><div className="flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Security controls are shown as unavailable instead of being simulated locally.</div></CardContent></Card>
            </TabsContent>

            <TabsContent value="wallet">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />Wallet</CardTitle><CardDescription>No wallet address is derived from your account ID.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">Wallet connection</p><p className="mt-1 font-medium">Not verified / not connected</p></div><UnavailableSetting title="Auto-stake rewards" description="Staking preferences require a verified wallet and staking backend." /><UnavailableSetting title="Transaction notifications" description="Wallet-activity notification preferences are not implemented." /></CardContent></Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
