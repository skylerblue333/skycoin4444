import { useEffect, useState } from "react";
import { Download, Lock, Trash2, UserRound } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Visibility = "public" | "members" | "private";

export default function PrivacySettings() {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const profile = trpc.user.profile.useQuery(
    user ? { userId: user.id } : undefined,
    { enabled: Boolean(user) }
  );
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.user.profile.invalidate();
    },
  });
  const [visibility, setVisibility] = useState<Visibility>("public");

  useEffect(() => {
    if (profile.data?.profileVisibility) {
      setVisibility(profile.data.profileVisibility as Visibility);
    }
  }, [profile.data?.profileVisibility]);

  if (loading) {
    return <main className="min-h-screen p-8">Loading account state…</main>;
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Privacy center</CardTitle>
            <CardDescription>
              Sign in to manage account privacy, export beta data, and request
              deletion review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => startLogin()}>
              Sign in
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <Badge variant="outline">Engineering beta privacy</Badge>
          <h1 className="mt-3 text-3xl font-bold">Privacy center</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Manage the privacy controls that are actually integrated into your
            authenticated beta account.
          </p>
        </header>

        <Card>
          <CardHeader>
            <Lock className="h-6 w-6 text-primary" />
            <CardTitle className="mt-2">Profile visibility</CardTitle>
            <CardDescription>
              This setting is stored against your account and controls profile
              redaction behavior in the current beta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={visibility}
              onChange={event =>
                setVisibility(event.target.value as Visibility)
              }
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="public">Public</option>
              <option value="members">Members</option>
              <option value="private">Private</option>
            </select>
            <Button
              type="button"
              disabled={updateProfile.isPending}
              onClick={() =>
                updateProfile.mutate({ profileVisibility: visibility })
              }
            >
              {updateProfile.isPending ? "Saving…" : "Save visibility"}
            </Button>
            {updateProfile.isSuccess && (
              <p className="text-sm text-emerald-600">
                Visibility setting saved.
              </p>
            )}
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <UserRound className="h-5 w-5 text-primary" />
              <CardTitle className="mt-2 text-base">Review profile</CardTitle>
              <CardDescription>
                Inspect and update the identity fields stored for your beta
                account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" className="w-full">
                  Open profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-5 w-5 text-primary" />
              <CardTitle className="mt-2 text-base">Export beta data</CardTitle>
              <CardDescription>
                Create a self-only JSON snapshot from currently integrated
                beta tables.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/data-export">
                <Button variant="outline" className="w-full">
                  Open export
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-destructive/25">
            <CardHeader>
              <Trash2 className="h-5 w-5 text-destructive" />
              <CardTitle className="mt-2 text-base">
                Request deletion review
              </CardTitle>
              <CardDescription>
                Record a durable account deletion request. Automated verified
                purge is not yet implemented.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/delete-account">
                <Button variant="outline" className="w-full">
                  Open deletion request
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-xl border p-4 text-sm leading-6 text-muted-foreground">
          These controls do not claim regulatory certification or exhaustive
          provider-wide data coverage. Unintegrated legacy and external systems
          remain outside this beta privacy surface.
        </section>
      </div>
    </main>
  );
}
