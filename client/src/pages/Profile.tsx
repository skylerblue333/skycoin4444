import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Pencil,
  UserRound,
} from "lucide-react";
import { Link, useRoute } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function Profile() {
  const [, params] = useRoute("/profile/:username");
  const username = params?.username;
  const { isAuthenticated, loading: authLoading } = useAuth();

  const ownProfile = trpc.user.me.useQuery(undefined, {
    enabled: isAuthenticated && !username,
  });
  const publicProfile = trpc.user.profileByUsername.useQuery(
    { username: username ?? "profile" },
    { enabled: Boolean(username) }
  );

  const isLoading =
    authLoading || ownProfile.isLoading || publicProfile.isLoading;
  const profile = username ? publicProfile.data : ownProfile.data;
  const error = username ? publicProfile.error : ownProfile.error;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <Loader2
          className="h-6 w-6 animate-spin"
          aria-label="Loading profile"
        />
      </main>
    );
  }

  if (!username && !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
        <div>
          <UserRound className="mx-auto mb-4 h-10 w-10 text-sky-400" />
          <h1 className="text-xl font-semibold">
            Sign in to view your profile
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Public profiles can be viewed through their username URL.
          </p>
          <Link href="/">
            <Button className="mt-6">Return home</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
        <div>
          <h1 className="text-xl font-semibold">Profile unavailable</h1>
          <p className="mt-2 text-sm text-slate-300">
            {error?.message ??
              "This profile does not exist or could not be loaded."}
          </p>
          <Link href="/">
            <Button className="mt-6" variant="outline">
              Return home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const displayName = profile.name || profile.username || "Skycoin member";
  const initial = displayName.charAt(0).toUpperCase();
  const isOwnProfile = !username;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <Card className="overflow-hidden border-slate-700 bg-slate-900">
          <div className="h-28 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700" />
          <CardContent className="relative px-6 pb-8 pt-0 sm:px-10">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-slate-900 bg-slate-800 text-3xl font-semibold text-white">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={`${displayName}'s profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <div className="pb-1">
                  <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
                    {displayName}
                    {profile.verified ? (
                      <CheckCircle2
                        className="h-5 w-5 text-sky-400"
                        aria-label="Verified profile"
                      />
                    ) : null}
                  </h1>
                  {profile.username ? (
                    <p className="mt-1 text-sm text-slate-300">
                      @{profile.username}
                    </p>
                  ) : null}
                </div>
              </div>
              {isOwnProfile ? (
                <Link href="/profile-edit">
                  <Button>
                    <Pencil className="mr-2 h-4 w-4" /> Edit profile
                  </Button>
                </Link>
              ) : null}
            </div>

            <div className="mt-8 grid gap-5 border-t border-slate-700 pt-6">
              {profile.bio ? (
                <p className="max-w-2xl whitespace-pre-wrap text-sm leading-6 text-slate-200">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  This member has not added a bio.
                </p>
              )}
              {profile.createdAt ? (
                <p className="flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays className="h-4 w-4" /> Joined{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
