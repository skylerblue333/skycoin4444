import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bell, Lock, Shield, UserRound, Wallet } from "lucide-react";

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
                <CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" />Account profile</CardTitle><CardDescription>Values below come from the authenticated server session.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{user?.name || "Not provided"}</p></div>
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{user?.email || "Not provided"}</p></div>
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Role</p><p className="font-medium">{user?.role || "user"}</p></div>
                    <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Account ID</p><p className="break-all font-mono text-sm">{user?.id || "Unavailable"}</p></div>
                  </div>
                  <UnavailableSetting title="Profile editing" description="Profile-write API is not verified yet, so this screen does not pretend local edits were saved." />
                  <Button variant="outline" onClick={() => void logout()}>Sign Out</Button>
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
