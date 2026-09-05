/*
 * Account surface: typed identity retrieval plus authorized profile/privacy
 * updates. No synthetic metrics or unsupported media claims.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Visibility = "public" | "members" | "private";
const USERNAME_PATTERN = /^[A-Za-z0-9_.-]+$/;

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const profile = trpc.user.profile.useQuery(
    user ? { userId: user.id } : undefined,
    { enabled: Boolean(user), retry: false }
  );
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.user.profile.invalidate(),
        utils.activation.status.invalidate(),
      ]);
    },
  });

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");

  useEffect(() => {
    if (!profile.data) return;
    setName(profile.data.name ?? "");
    setUsername(profile.data.username ?? "");
    setBio(profile.data.bio ?? "");
    setVisibility(profile.data.profileVisibility as Visibility);
  }, [profile.data]);

  const normalizedUsername = username.trim();
  const usernameValid = useMemo(
    () =>
      normalizedUsername.length >= 2 &&
      normalizedUsername.length <= 64 &&
      USERNAME_PATTERN.test(normalizedUsername),
    [normalizedUsername]
  );
  const canSave =
    Boolean(name.trim()) &&
    usernameValid &&
    !updateProfile.isPending &&
    !profile.isLoading;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#050510] px-4 py-14 text-white">
        <Card className="mx-auto w-full max-w-lg border-white/10 bg-white/[0.035] text-white">
          <CardHeader>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-300/10 text-sky-200">
              <UserRound className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-3xl">Account profile</CardTitle>
            <CardDescription className="text-white/50">
              Sign in through the canonical invitation flow to manage your
              account-owned profile and privacy settings.
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

  const save = () => {
    if (!canSave) return;
    updateProfile.mutate({
      name: name.trim(),
      username: normalizedUsername,
      bio: bio.trim() || null,
      profileVisibility: visibility,
    });
  };

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-300/10 text-sky-200">
              <UserRound className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight">
                  Your profile
                </h1>
                <Badge
                  variant="outline"
                  className="border-emerald-300/25 text-emerald-100"
                >
                  Persisted account
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                Manage the identity fields and visibility policy stored against
                your authenticated beta account.
              </p>
            </div>
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

        {profile.isLoading ? (
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardContent className="p-8 text-sm text-white/45">
              Loading persisted profile…
            </CardContent>
          </Card>
        ) : profile.error ? (
          <Card className="border-rose-300/20 bg-rose-300/[0.04] text-white">
            <CardContent className="p-6 text-sm text-rose-100" role="alert">
              Your profile could not be loaded. Refresh the page before making
              changes.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="text-white">Identity</CardTitle>
                <CardDescription className="text-white/50">
                  These fields are stored against your authenticated account and
                  feed the activation journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium">
                    <span>Display name</span>
                    <Input
                      value={name}
                      maxLength={255}
                      onChange={event => setName(event.target.value)}
                      placeholder="How you want to appear"
                    />
                    <span className="block text-xs font-normal text-white/35">
                      {name.length}/255
                    </span>
                  </label>

                  <label className="space-y-2 text-sm font-medium">
                    <span>Username</span>
                    <Input
                      value={username}
                      maxLength={64}
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={Boolean(username) && !usernameValid}
                      onChange={event => setUsername(event.target.value)}
                      placeholder="builder_44"
                    />
                    <span
                      className={
                        "block text-xs font-normal " +
                        (username && !usernameValid
                          ? "text-amber-200"
                          : "text-white/35")
                      }
                    >
                      2–64 characters: letters, numbers, dot, dash, underscore.
                    </span>
                  </label>
                </div>

                <label className="block space-y-2 text-sm font-medium">
                  <span>Bio</span>
                  <Textarea
                    value={bio}
                    maxLength={255}
                    onChange={event => setBio(event.target.value)}
                    placeholder="A short description of what you are building."
                  />
                  <span className="block text-xs font-normal text-white/35">
                    {bio.length}/255
                  </span>
                </label>

                <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-white/35">
                    Usernames must also be unique; a conflict is reported
                    without overwriting another account.
                  </p>
                  <Button disabled={!canSave} onClick={save}>
                    {updateProfile.isPending ? "Saving…" : "Save profile"}
                  </Button>
                </div>

                {updateProfile.isSuccess ? (
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.05] p-4 text-sm text-emerald-100"
                    role="status"
                    aria-live="polite"
                  >
                    <span>Profile saved to your account.</span>
                    <Link
                      href="/onboarding"
                      className="inline-flex items-center font-semibold text-emerald-100"
                    >
                      Continue activation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                ) : null}

                {updateProfile.error ? (
                  <p
                    className="rounded-xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
                    role="alert"
                  >
                    {updateProfile.error.message}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-5 w-5 text-emerald-200" />
                  Privacy
                </CardTitle>
                <CardDescription className="text-white/50">
                  Choose how your profile is presented to other authenticated
                  users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="block space-y-2 text-sm font-medium">
                  <span>Profile visibility</span>
                  <select
                    value={visibility}
                    onChange={event =>
                      setVisibility(event.target.value as Visibility)
                    }
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
                  >
                    <option value="public">
                      Public — name, bio, and username visible
                    </option>
                    <option value="members">
                      Members — authenticated-member policy
                    </option>
                    <option value="private">
                      Private — redact profile details from other viewers
                    </option>
                  </select>
                </label>
                <p className="text-sm leading-6 text-white/45">
                  Your own profile remains visible to you. Private profiles
                  redact public identity fields and follower counts for other
                  viewers. This setting is a product privacy control, not legal
                  identity verification.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
