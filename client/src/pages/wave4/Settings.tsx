import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import UnavailableFeature from "@/components/UnavailableFeature";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const profile = trpc.user.profile.useQuery(
    { userId: user?.id ?? "" },
    { enabled: Boolean(user?.id) }
  );
  const updateProfile = trpc.user.updateProfile.useMutation();

  useEffect(() => {
    if (profile.data) {
      setName(profile.data.name ?? profile.data.username ?? "");
      setBio(profile.data.bio ?? "");
    }
  }, [profile.data]);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto max-w-3xl p-6">
        <Card className="p-6">
          <p className="text-muted-foreground">
            Please log in to access Settings.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the account settings that are currently connected to verified
          backend contracts.
        </p>
      </header>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="space-y-5 p-6">
            <div>
              <h2 className="text-lg font-semibold">Profile information</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Profile writes are validated server-side. Unsupported fields are
                not submitted.
              </p>
            </div>
            <label className="block text-sm font-medium">
              Name
              <Input
                className="mt-2"
                value={name}
                onChange={event => setName(event.target.value)}
                maxLength={120}
              />
            </label>
            <label className="block text-sm font-medium">
              Bio
              <Textarea
                className="mt-2"
                value={bio}
                onChange={event => setBio(event.target.value)}
                maxLength={2000}
                rows={5}
              />
            </label>
            <Button
              type="button"
              disabled={updateProfile.isPending || profile.isLoading}
              onClick={() => updateProfile.mutate({ name, bio })}
            >
              {updateProfile.isPending ? "Saving..." : "Save profile"}
            </Button>
            {updateProfile.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                The server returned an unavailable result; no profile change was
                claimed.
              </p>
            ) : null}
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <UnavailableFeature
            name="Privacy settings"
            reason="Privacy preference persistence is not exposed as a verified production backend contract yet."
          />
        </TabsContent>
        <TabsContent value="notifications">
          <UnavailableFeature
            name="Notification preferences"
            reason="Per-account notification preference persistence is not exposed as a verified production backend contract yet."
          />
        </TabsContent>
        <TabsContent value="preferences">
          <UnavailableFeature
            name="Application preferences"
            reason="Theme, language, and timezone persistence is not exposed as a verified production backend contract yet."
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
