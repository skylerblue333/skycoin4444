import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  Flag,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  RefreshCcw,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundPen,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { buildConversationStarters } from "@/lib/datingExperience";

type GenderPreference = "men" | "women" | "everyone";
type DatingAction = "like" | "superlike" | "pass";
type ReportReason =
  | "fake_profile"
  | "harassment"
  | "scam_money"
  | "underage_concern"
  | "unsafe_behavior"
  | "other";

const reportReasonLabels: Record<ReportReason, string> = {
  fake_profile: "Fake or impersonated profile",
  harassment: "Harassment or threats",
  scam_money: "Money / crypto / gift-card scam",
  underage_concern: "Possible underage use",
  unsafe_behavior: "Unsafe behavior",
  other: "Other concern",
};

export default function DatingDiscovery() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();

  const preferences = trpc.dating.preferences.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const profile = trpc.dating.profile.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(65);
  const [genderPreference, setGenderPreference] =
    useState<GenderPreference>("everyone");
  const [locationFilter, setLocationFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [preferencesInitialized, setPreferencesInitialized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [reportReason, setReportReason] =
    useState<ReportReason>("unsafe_behavior");
  const [reportDetails, setReportDetails] = useState("");
  const [blockAfterReport, setBlockAfterReport] = useState(true);

  useEffect(() => {
    if (!preferences.data || preferencesInitialized) return;
    setMinAge(preferences.data.minAge);
    setMaxAge(preferences.data.maxAge);
    setGenderPreference(
      preferences.data.genderPreference as GenderPreference
    );
    setPreferencesInitialized(true);
  }, [preferences.data, preferencesInitialized]);

  const discovery = trpc.dating.discover.useQuery(
    {
      minAge,
      maxAge,
      genderPreference,
      location: locationFilter || undefined,
      interest: interestFilter || undefined,
      limit: 25,
    },
    {
      enabled: isAuthenticated && preferencesInitialized,
      retry: false,
    }
  );

  const currentProfile = discovery.data?.profiles[0];

  const starters = useMemo(
    () => (currentProfile ? buildConversationStarters(currentProfile) : []),
    [currentProfile]
  );

  const refreshDating = async () => {
    await Promise.all([
      utils.dating.discover.invalidate(),
      utils.dating.summary.invalidate(),
      utils.dating.matches.invalidate(),
      utils.dating.notifications.invalidate(),
    ]);
  };

  const actionMutation = trpc.dating.act.useMutation({
    onSuccess: async result => {
      setSafetyOpen(false);
      setStatusMessage(
        result.matched
          ? "It is a mutual match. Messaging is now available."
          : result.action === "pass"
            ? "Profile passed."
            : result.action === "superlike"
              ? "Super Like saved."
              : "Like saved."
      );
      await refreshDating();
    },
  });

  const savePreferences = trpc.dating.savePreferences.useMutation({
    onSuccess: async () => {
      setStatusMessage("Discovery preferences saved.");
      await utils.dating.preferences.invalidate();
      await utils.dating.discover.invalidate();
    },
  });

  const blockMutation = trpc.dating.block.useMutation({
    onSuccess: async () => {
      setSafetyOpen(false);
      setStatusMessage("Profile blocked.");
      await refreshDating();
    },
  });

  const reportMutation = trpc.dating.report.useMutation({
    onSuccess: async result => {
      setSafetyOpen(false);
      setReportDetails("");
      setStatusMessage(result.message);
      await refreshDating();
    },
  });

  const runAction = (action: DatingAction) => {
    if (!currentProfile || actionMutation.isPending) return;
    setStatusMessage(null);
    actionMutation.mutate({
      profileUserId: currentProfile.userId,
      action,
    });
  };

  const resetFilters = () => {
    setMinAge(preferences.data?.minAge ?? 18);
    setMaxAge(preferences.data?.maxAge ?? 65);
    setGenderPreference(
      (preferences.data?.genderPreference as GenderPreference | undefined) ??
        "everyone"
    );
    setLocationFilter("");
    setInterestFilter("");
  };

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090404] text-white">
        <div className="flex items-center gap-3" role="status">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading dating access…
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090404] p-4 text-white">
        <Card className="w-full max-w-lg border-white/10 bg-white/[0.04] p-7 text-center text-white">
          <ShieldCheck className="mx-auto h-12 w-12 text-pink-300" />
          <h1 className="mt-4 text-2xl font-black">Sign in for discovery</h1>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Server-backed adult discovery, likes, mutual matches, blocking, and
            reporting require an authenticated beta account.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/signin">
              <Button>Sign in</Button>
            </Link>
            <Link href="/dating-profile-setup">
              <Button variant="outline" className="border-white/10 text-white">
                Prepare profile
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  if (profile.isLoading || preferences.isLoading || !preferencesInitialized) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090404] text-white">
        <div className="flex items-center gap-3" role="status">
          <Loader2 className="h-5 w-5 animate-spin" />
          Preparing discovery…
        </div>
      </main>
    );
  }

  if (!profile.data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090404] p-4 text-white">
        <Card className="w-full max-w-lg border-white/10 bg-white/[0.04] p-7 text-center text-white">
          <UserRoundPen className="mx-auto h-12 w-12 text-pink-300" />
          <h1 className="mt-4 text-2xl font-black">Create a dating profile first</h1>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Discovery excludes self and uses your profile interests/location to
            explain factual overlap. Create the adult dating profile before
            browsing.
          </p>
          <Link href="/dating-profile-setup">
            <Button className="mt-5 bg-pink-600 hover:bg-pink-500">
              Build profile
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090404] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-pink-200">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">
                Adult discovery
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Discover with context, not blind swipes
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Prior likes, active matches, rejected pairs, private profiles,
              blocks, and under-18 profiles are excluded. Shared signals are
              exact stored overlap—not a prediction that a relationship will
              work.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dating-home">
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
              >
                Dating home
              </Button>
            </Link>
            <Link href="/dating-matches">
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Matches
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="h-fit border-white/10 bg-white/[0.04] p-5 text-white">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-violet-300" />
              <h2 className="font-black">Discovery preferences</h2>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/40">
              Age range and gender preference can be persisted. Location and
              interest filters stay query-only.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-white/60">
                Minimum age
                <Input
                  type="number"
                  min={18}
                  max={120}
                  value={minAge}
                  onChange={event => {
                    const next = Math.max(
                      18,
                      Math.min(120, Number(event.target.value) || 18)
                    );
                    setMinAge(Math.min(next, maxAge));
                  }}
                  className="mt-1"
                />
              </label>
              <label className="text-xs font-semibold text-white/60">
                Maximum age
                <Input
                  type="number"
                  min={18}
                  max={120}
                  value={maxAge}
                  onChange={event => {
                    const next = Math.max(
                      18,
                      Math.min(120, Number(event.target.value) || 18)
                    );
                    setMaxAge(Math.max(next, minAge));
                  }}
                  className="mt-1"
                />
              </label>
            </div>

            <label className="mt-3 block text-xs font-semibold text-white/60">
              Show me
              <select
                value={genderPreference}
                onChange={event =>
                  setGenderPreference(event.target.value as GenderPreference)
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white"
              >
                <option value="everyone">Everyone</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </label>

            <label className="mt-3 block text-xs font-semibold text-white/60">
              Location contains
              <Input
                value={locationFilter}
                onChange={event => setLocationFilter(event.target.value)}
                placeholder="City or region"
                className="mt-1"
              />
            </label>

            <label className="mt-3 block text-xs font-semibold text-white/60">
              Interest contains
              <Input
                value={interestFilter}
                onChange={event => setInterestFilter(event.target.value)}
                placeholder="Music, hiking, chess…"
                className="mt-1"
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
                onClick={resetFilters}
              >
                Reset
              </Button>
              <Button
                onClick={() =>
                  savePreferences.mutate({
                    minAge,
                    maxAge,
                    genderPreference,
                  })
                }
                disabled={savePreferences.isPending}
                className="bg-violet-600 hover:bg-violet-500"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>

            <div className="mt-5 rounded-xl border border-amber-200/10 bg-amber-200/[0.05] p-3 text-xs leading-5 text-amber-100/65">
              Precise-distance filtering is intentionally unavailable because
              this beta does not collect or claim precise dating geolocation.
            </div>
          </Card>

          <div>
            {discovery.isLoading ? (
              <Card className="grid min-h-[620px] place-items-center border-white/10 bg-white/[0.04] text-white">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading adult profiles…
                </div>
              </Card>
            ) : discovery.isError ? (
              <Card className="grid min-h-[620px] place-items-center border-red-400/20 bg-red-400/[0.06] p-6 text-center text-white">
                <div>
                  <AlertTriangle className="mx-auto h-10 w-10 text-red-300" />
                  <h2 className="mt-3 text-xl font-black">
                    Discovery could not load
                  </h2>
                  <p className="mt-2 text-sm text-white/55">
                    {discovery.error.message}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => void discovery.refetch()}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </div>
              </Card>
            ) : !currentProfile ? (
              <Card className="grid min-h-[620px] place-items-center border-white/10 bg-white/[0.04] p-6 text-center text-white">
                <div>
                  <Heart className="mx-auto h-12 w-12 text-pink-300/50" />
                  <h2 className="mt-4 text-2xl font-black">
                    No profiles match these filters
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                    Try widening the age range, clearing location or interest
                    filters, or return later as more adult beta profiles become
                    available.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-white/10 bg-white/[0.03] text-white"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <Card className="overflow-hidden border-white/10 bg-white/[0.04] text-white">
                  <div className="relative min-h-[380px] overflow-hidden bg-gradient-to-br from-pink-600/70 via-violet-700/60 to-slate-950 p-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.18),transparent_45%)]" />
                    <div className="relative flex min-h-[330px] flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-bold text-white/80">
                          Server-backed adult profile
                        </span>
                        <span className="rounded-full border border-pink-200/20 bg-pink-200/10 px-3 py-1 text-xs font-bold text-pink-100">
                          {currentProfile.sharedSignalCount} shared signal
                          {currentProfile.sharedSignalCount === 1 ? "" : "s"}
                        </span>
                      </div>

                      {currentProfile.profileImageUrl ? (
                        <img
                          src={currentProfile.profileImageUrl}
                          alt={currentProfile.displayName}
                          className="mx-auto h-40 w-40 rounded-[2rem] border-4 border-white/35 object-cover shadow-2xl"
                        />
                      ) : (
                        <div className="mx-auto grid h-40 w-40 place-items-center rounded-[2rem] border-4 border-white/25 bg-white/10 text-6xl font-black shadow-2xl">
                          {currentProfile.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="rounded-2xl bg-black/40 p-5 backdrop-blur">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <h2 className="text-3xl font-black">
                              {currentProfile.displayName}, {currentProfile.age}
                            </h2>
                            <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
                              <MapPin className="h-4 w-4" />
                              {currentProfile.location || "Location not listed"}
                            </p>
                          </div>
                          {currentProfile.lookingFor ? (
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold capitalize">
                              {currentProfile.lookingFor}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/80">
                          {currentProfile.bio || "No bio added yet."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 lg:grid-cols-2">
                    <section>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                        Interests
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentProfile.interests.length ? (
                          currentProfile.interests.map(interest => (
                            <span
                              key={interest}
                              className={
                                "rounded-full px-3 py-1 text-xs font-semibold " +
                                (currentProfile.sharedInterests.includes(interest)
                                  ? "bg-pink-400/15 text-pink-200 ring-1 ring-pink-300/20"
                                  : "bg-white/[0.06] text-white/65")
                              }
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-white/35">
                            No interests listed.
                          </span>
                        )}
                      </div>
                    </section>

                    <section>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                        Why it surfaced
                      </p>
                      <div className="mt-2 space-y-2 text-sm text-white/60">
                        {currentProfile.sharedInterests.length ? (
                          <p>
                            Shared interests:{" "}
                            {currentProfile.sharedInterests.join(", ")}.
                          </p>
                        ) : (
                          <p>No exact shared interests were found.</p>
                        )}
                        {currentProfile.sameGeneralLocation ? (
                          <p>You share a comma-delimited location component.</p>
                        ) : (
                          <p>No exact general-location component matched.</p>
                        )}
                      </div>
                    </section>

                    <section className="lg:col-span-2">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                        Conversation starters
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        {starters.map(prompt => (
                          <div
                            key={prompt}
                            className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-sm text-white/65"
                          >
                            {prompt}
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </Card>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    aria-label="Pass profile"
                    disabled={actionMutation.isPending}
                    onClick={() => runAction("pass")}
                    variant="outline"
                    className="h-14 w-14 rounded-full border-white/10 bg-white/[0.04] p-0 text-white"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  <Button
                    aria-label="Super Like profile"
                    disabled={actionMutation.isPending}
                    onClick={() => runAction("superlike")}
                    className="h-14 w-14 rounded-full bg-violet-600 p-0 hover:bg-violet-500"
                  >
                    <Star className="h-6 w-6" />
                  </Button>
                  <Button
                    aria-label="Like profile"
                    disabled={actionMutation.isPending}
                    onClick={() => runAction("like")}
                    className="h-16 w-16 rounded-full bg-pink-600 p-0 hover:bg-pink-500"
                  >
                    {actionMutation.isPending ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Heart className="h-7 w-7" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/10 bg-white/[0.04] text-white"
                    onClick={() => setSafetyOpen(value => !value)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Safety
                  </Button>
                </div>

                {safetyOpen ? (
                  <Card className="mt-4 border-amber-200/15 bg-amber-200/[0.05] p-5 text-white">
                    <h3 className="font-black">Safety actions</h3>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Blocking is immediate for this beta account. Reports are
                      recorded as pending for review and are not an emergency
                      response service.
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <select
                        value={reportReason}
                        onChange={event =>
                          setReportReason(event.target.value as ReportReason)
                        }
                        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white"
                      >
                        {(Object.keys(reportReasonLabels) as ReportReason[]).map(
                          reason => (
                            <option key={reason} value={reason}>
                              {reportReasonLabels[reason]}
                            </option>
                          )
                        )}
                      </select>
                      <Input
                        value={reportDetails}
                        maxLength={160}
                        onChange={event => setReportDetails(event.target.value)}
                        placeholder="Optional details"
                      />
                      <label className="flex items-center gap-2 text-xs text-white/60">
                        <input
                          type="checkbox"
                          checked={blockAfterReport}
                          onChange={event =>
                            setBlockAfterReport(event.target.checked)
                          }
                        />
                        Block after report
                      </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="border-white/10 bg-white/[0.04] text-white"
                        disabled={blockMutation.isPending}
                        onClick={() =>
                          blockMutation.mutate({
                            userId: currentProfile.userId,
                            reason: "blocked from discovery",
                          })
                        }
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Block
                      </Button>
                      <Button
                        className="bg-amber-600 hover:bg-amber-500"
                        disabled={reportMutation.isPending}
                        onClick={() =>
                          reportMutation.mutate({
                            userId: currentProfile.userId,
                            reason: reportReason,
                            details: reportDetails || undefined,
                            blockAfterReport,
                          })
                        }
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        Report concern
                      </Button>
                    </div>
                  </Card>
                ) : null}
              </>
            )}

            <div className="mt-4 min-h-6 text-center text-sm" aria-live="polite">
              {actionMutation.isError ? (
                <span className="text-red-300">
                  {actionMutation.error.message}
                </span>
              ) : blockMutation.isError ? (
                <span className="text-red-300">
                  {blockMutation.error.message}
                </span>
              ) : reportMutation.isError ? (
                <span className="text-red-300">
                  {reportMutation.error.message}
                </span>
              ) : savePreferences.isError ? (
                <span className="text-red-300">
                  {savePreferences.error.message}
                </span>
              ) : statusMessage ? (
                <span className="text-emerald-300">{statusMessage}</span>
              ) : (
                <span className="text-white/25">
                  Likes, passes, blocks, reports, and matches are server-backed
                  for the authenticated beta account.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
