import { useEffect, useState } from "react";
import {
  ArrowRight,
  Download,
  Lock,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
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
    { enabled: Boolean(user), retry: false }
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
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#050510] px-4 py-14 text-white">
        <Card className="mx-auto w-full max-w-lg border-white/10 bg-white/[0.035] text-white">
          <CardHeader>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-3xl">Privacy center</CardTitle>
            <CardDescription className="text-white/50">
              Sign in through the canonical invitation flow to manage account
              privacy, export integrated beta data, and request deletion review.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href="/signin">
              <Button className="w-full">
                Open invitation sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/beta-workspace">
              <Button
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                Browse public labs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const persistedVisibility =
    (profile.data?.profileVisibility as Visibility | undefined) ?? "public";
  const hasChange = visibility !== persistedVisibility;

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-300/25 bg-emerald-300/[0.04] text-emerald-100"
              >
                Engineering beta privacy
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Account-scoped controls
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Privacy center
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              Manage the privacy controls that are actually integrated into
              this authenticated beta account. Unintegrated legacy and external
              systems remain outside this surface.
            </p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-white/15 bg-white/[0.03] text-white"
            >
              Back to dashboard
            </Button>
          </Link>
        </header>

        {profile.error ? (
          <div
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
            role="alert"
          >
            Current profile privacy could not be loaded. Refresh before making a
            visibility change.
          </div>
        ) : null}

        {updateProfile.error ? (
          <div
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
            role="alert"
          >
            Visibility could not be saved: {updateProfile.error.message}
          </div>
        ) : null}

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <Lock className="h-6 w-6 text-emerald-200" />
            <CardTitle className="mt-2 text-white">
              Profile visibility
            </CardTitle>
            <CardDescription className="text-white/45">
              This value is stored against your account and controls the current
              beta's profile-redaction behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {profile.isLoading ? (
              <p className="text-sm text-white/40">
                Loading persisted visibility…
              </p>
            ) : (
              <>
                <label className="block space-y-2 text-sm font-medium">
                  <span>Who can see profile fields?</span>
                  <select
                    value={visibility}
                    onChange={event =>
                      setVisibility(event.target.value as Visibility)
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40"
                  >
                    <option value="public">
                      Public — expose allowed profile fields
                    </option>
                    <option value="members">
                      Members — authenticated-member policy
                    </option>
                    <option value="private">
                      Private — redact profile identity fields for others
                    </option>
                  </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["public", "Public", "Uses the current public-profile policy."],
                    ["members", "Members", "Reserved for authenticated-member visibility."],
                    ["private", "Private", "Redacts profile identity fields for other viewers."],
                  ].map(([value, title, detail]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setVisibility(value as Visibility)}
                      aria-pressed={visibility === value}
                      className={
                        "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40 " +
                        (visibility === value
                          ? "border-emerald-300/30 bg-emerald-300/[0.06]"
                          : "border-white/10 bg-black/20 hover:border-white/20")
                      }
                    >
                      <strong className="text-sm text-white">{title}</strong>
                      <p className="mt-1 text-xs leading-5 text-white/35">
                        {detail}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-white/35">
                    Current saved setting:{" "}
                    <span className="font-semibold text-white/55">
                      {persistedVisibility}
                    </span>
                  </p>
                  <Button
                    type="button"
                    disabled={
                      updateProfile.isPending ||
                      profile.isLoading ||
                      !hasChange
                    }
                    onClick={() =>
                      updateProfile.mutate({
                        profileVisibility: visibility,
                      })
                    }
                  >
                    {updateProfile.isPending
                      ? "Saving…"
                      : hasChange
                        ? "Save visibility"
                        : "Visibility saved"}
                  </Button>
                </div>

                {updateProfile.isSuccess ? (
                  <p
                    className="text-sm text-emerald-200"
                    role="status"
                    aria-live="polite"
                  >
                    Visibility setting persisted to this account.
                  </p>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <UserRound className="h-5 w-5 text-sky-200" />
              <CardTitle className="mt-2 text-base text-white">
                Review profile
              </CardTitle>
              <CardDescription className="text-white/45">
                Inspect and update the identity fields stored for your beta
                account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-white/[0.03] text-white"
                >
                  Open profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <Download className="h-5 w-5 text-violet-200" />
              <CardTitle className="mt-2 text-base text-white">
                Export beta data
              </CardTitle>
              <CardDescription className="text-white/45">
                Generate a self-only JSON snapshot from currently integrated
                beta records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/data-export">
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-white/[0.03] text-white"
                >
                  Open export
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-rose-300/20 bg-rose-300/[0.035] text-white">
            <CardHeader>
              <Trash2 className="h-5 w-5 text-rose-200" />
              <CardTitle className="mt-2 text-base text-white">
                Request deletion review
              </CardTitle>
              <CardDescription className="text-white/45">
                Record a durable deletion request. Automated verified full
                purge is not yet implemented.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/delete-account">
                <Button
                  variant="outline"
                  className="w-full border-rose-300/20 bg-rose-300/[0.03] text-white"
                >
                  Open deletion request
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          These controls do not claim regulatory certification, exhaustive
          provider-wide data coverage, completed erasure, or independent
          identity verification. They describe only the beta records and
          workflows currently integrated in this application.
        </section>
      </div>
    </main>
  );
}
