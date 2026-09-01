import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startLogin } from "@/const";
import {
  Activity,
  Camera,
  Image as ImageIcon,
  LayoutGrid,
  LockKeyhole,
  ShieldAlert,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

const REQUIREMENTS = [
  { icon: UserRound, label: "Profile identity", detail: "Typed account or username profile retrieval" },
  { icon: ImageIcon, label: "Media", detail: "Persisted avatar, banner, validation, and storage lifecycle" },
  { icon: UsersRound, label: "Social graph", detail: "Authorization-aware follows, visibility, and ownership" },
  { icon: LayoutGrid, label: "Posts & achievements", detail: "Persisted feed and achievement contracts" },
  { icon: Activity, label: "Analytics", detail: "Metrics derived from persisted events" },
] as const;

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-48 rounded-3xl bg-muted" />
          <div className="h-40 rounded-2xl bg-muted" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-lg overflow-hidden p-0">
          <div className="h-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600" />
          <CardContent className="-mt-10 space-y-5 p-6 sm:p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card bg-background shadow-xl">
              <UserRound className="h-9 w-9 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-3">Profile workspace</Badge>
              <h1 className="text-2xl font-bold tracking-tight">Your SKYCOIN4444 profile</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in to access account-scoped profile capabilities. The demo does not generate a fake identity when profile services are unavailable.
              </p>
            </div>
            <Button onClick={() => startLogin()} size="lg" className="w-full">Sign in to continue</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="h-44 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent_25%),linear-gradient(120deg,#2563eb,#4f46e5_48%,#7c3aed)] sm:h-56" />
          <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-card bg-background shadow-xl sm:h-28 sm:w-28">
                  <UserRound className="h-11 w-11 text-primary" />
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Signed-in account</h1>
                    <Badge variant="outline">Engineering beta</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Canonical profile data is not active on this surface yet.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled><Camera className="h-4 w-4" />Edit media</Button>
                <Button disabled><Sparkles className="h-4 w-4" />Edit profile</Button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
          <section className="space-y-6">
            <Card className="border-amber-500/30 bg-amber-500/[0.05]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-amber-500/10 p-2.5"><ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-300" /></div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">Profile service connection required</h2>
                      <Badge variant="secondary">Unavailable</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      This page intentionally avoids synthetic followers, creator analytics, achievements, posts, uploads, or local-only profile success. Activation requires typed persisted profile and social contracts with authorization tests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LayoutGrid className="h-5 w-5 text-primary" />Profile activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-dashed bg-muted/35 px-6 py-12 text-center">
                  <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-4 font-semibold">Activity will appear here</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Posts, achievements, and account activity stay empty until a verified persisted feed is connected.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-primary" />Activation readiness</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {REQUIREMENTS.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="rounded-xl border bg-muted/25 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-medium"><Icon className="h-4 w-4 text-primary" />{label}</div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <p className="px-1 text-xs leading-5 text-muted-foreground">
              No profile query, feed query, achievement query, follow mutation, media upload, analytics calculation, or synthetic success path is initiated by this page.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
