import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Heart, Loader2, MessageCircle, RefreshCcw, ShieldCheck, Sparkles, Star, UserRoundPen, X } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  clampAdultAge,
  isAdultAge,
  submitDatingAction,
  type DatingAction,
} from '@/lib/datingDiscovery';
import {
  DATING_SESSION_PROFILE_KEY,
  buildConnectionSignals,
  buildConversationStarters,
  parseDatingDraftSignals,
} from '@/lib/datingExperience';

interface Profile {
  id: string;
  displayName: string;
  age: number;
  location: string;
  bio: string;
  profileImageUrl: string;
  interests: string[];
  compatibility: number;
}

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<Profile>;
  return (
    typeof profile.id === 'string' &&
    profile.id.trim().length > 0 &&
    typeof profile.displayName === 'string' &&
    isAdultAge(profile.age) &&
    typeof profile.location === 'string' &&
    typeof profile.bio === 'string' &&
    typeof profile.profileImageUrl === 'string' &&
    Array.isArray(profile.interests) &&
    profile.interests.every((interest) => typeof interest === 'string') &&
    typeof profile.compatibility === 'number' &&
    Number.isFinite(profile.compatibility)
  );
}

export default function DatingDiscovery() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState<DatingAction | null>(null);
  const [failedAction, setFailedAction] = useState<DatingAction | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [superLiked, setSuperLiked] = useState<Set<string>>(new Set());
  const [decisions, setDecisions] = useState(0);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(80);
  const [locationFilter, setLocationFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [dragStart, setDragStart] = useState<number | null>(null);
  const savedDraft = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return parseDatingDraftSignals(sessionStorage.getItem(DATING_SESSION_PROFILE_KEY));
    } catch {
      return null;
    }
  }, []);

  const filteredProfiles = useMemo(
    () =>
      profiles.filter((profile) => {
        const locationMatches =
          !locationFilter.trim() ||
          profile.location.toLowerCase().includes(locationFilter.trim().toLowerCase());
        const interestMatches =
          !interestFilter.trim() ||
          profile.interests.some((interest) =>
            interest.toLowerCase().includes(interestFilter.trim().toLowerCase()),
          );
        return (
          profile.age >= minAge &&
          profile.age <= maxAge &&
          locationMatches &&
          interestMatches
        );
      }),
    [profiles, minAge, maxAge, locationFilter, interestFilter],
  );

  const currentProfile = filteredProfiles[0];
  const connectionSignals = useMemo(
    () =>
      currentProfile
        ? buildConnectionSignals(savedDraft, currentProfile)
        : [],
    [savedDraft, currentProfile],
  );
  const conversationStarters = useMemo(
    () => (currentProfile ? buildConversationStarters(currentProfile) : []),
    [currentProfile],
  );

  const loadProfiles = async () => {
    setLoading(true);
    setLoadError(null);
    setActionError(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/dating/discover');
      if (!response.ok) {
        throw new Error(`Unable to load discovery profiles (${response.status}).`);
      }

      const data = (await response.json()) as { profiles?: unknown };
      if (!Array.isArray(data.profiles)) {
        throw new Error('The discovery service returned an invalid response.');
      }

      // Dating is 18+ only. Invalid or underage records are never rendered.
      setProfiles(data.profiles.filter(isProfile));
    } catch (error) {
      console.error('Failed to load profiles:', error);
      setProfiles([]);
      setLoadError(error instanceof Error ? error.message : 'Unable to load discovery profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfiles();
  }, []);

  const runAction = async (action: DatingAction) => {
    if (!currentProfile || actionPending) return;

    const profileId = currentProfile.id;
    setActionPending(action);
    setActionError(null);
    setFailedAction(null);
    setStatusMessage(null);

    try {
      await submitDatingAction(fetch, profileId, action);

      if (action === 'like') {
        setLiked((previous) => new Set(previous).add(profileId));
      } else if (action === 'superlike') {
        setSuperLiked((previous) => new Set(previous).add(profileId));
      }

      setProfiles((previous) => previous.filter((profile) => profile.id !== profileId));
      setDecisions((previous) => previous + 1);
      setStatusMessage(
        action === 'pass'
          ? 'Profile passed.'
          : action === 'superlike'
            ? 'Super Like saved.'
            : 'Like saved.',
      );
    } catch (error) {
      console.error(`Failed to ${action} profile:`, error);
      setActionError(error instanceof Error ? error.message : 'That action could not be saved.');
      setFailedAction(action);
    } finally {
      setActionPending(null);
    }
  };

  const handleSwipeEnd = (endX: number) => {
    if (dragStart === null || actionPending) return;
    const delta = endX - dragStart;
    setDragStart(null);
    if (Math.abs(delta) < 70) return;
    void runAction(delta > 0 ? 'like' : 'pass');
  };

  const clearFilters = () => {
    setMinAge(18);
    setMaxAge(80);
    setLocationFilter('');
    setInterestFilter('');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
        <div className="flex items-center gap-3 text-xl font-semibold text-white" role="status" aria-live="polite">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          Loading discovery…
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4">
        <Card className="w-full max-w-md p-6 text-center shadow-2xl">
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-500" aria-hidden="true" />
          <h1 className="mb-2 text-2xl font-bold">Discovery is unavailable</h1>
          <p className="mb-5 text-sm text-muted-foreground" role="alert">{loadError}</p>
          <Button onClick={() => void loadProfiles()} className="gap-2">
            <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentProfile) {
    const filtersActive =
      minAge !== 18 ||
      maxAge !== 80 ||
      Boolean(locationFilter.trim()) ||
      Boolean(interestFilter.trim());

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4">
        <Card className="w-full max-w-md p-6 text-center shadow-2xl">
          <Heart className="mx-auto mb-3 h-10 w-10 text-pink-500" aria-hidden="true" />
          <h2 className="mb-2 text-3xl font-bold">No profiles to show</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            {filtersActive
              ? 'Your current filters do not match any available adult profiles.'
              : 'You have reached the end of the currently available discovery profiles.'}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {filtersActive && <Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
            <Button onClick={() => void loadProfiles()} className="gap-2">
              <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Refresh discovery
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-5 text-center text-white">
          <div className="mx-auto mb-3 flex flex-wrap justify-center gap-2">
            <Link href="/dating-profile-setup">
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <UserRoundPen className="mr-2 h-4 w-4" /> Edit profile
              </Button>
            </Link>
            <Link href="/dating-matches">
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <MessageCircle className="mr-2 h-4 w-4" /> Matches
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Discover with context</h1>
          <p className="text-pink-100">Use filters, shared interests, and conversation prompts instead of blind swiping.</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> 18+ discovery only
          </div>
        </div>

        <div className="mb-5 rounded-2xl bg-white/15 p-4 text-white backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <strong>Discovery filters</strong>
            <span className="text-xs text-pink-100">{filteredProfiles.length} candidates</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              Min age
              <input
                aria-label="Minimum age"
                type="number"
                min={18}
                max={80}
                value={minAge}
                onChange={(event) => setMinAge(Math.min(clampAdultAge(Number(event.target.value)), maxAge))}
                className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900"
              />
            </label>
            <label className="text-xs">
              Max age
              <input
                aria-label="Maximum age"
                type="number"
                min={18}
                max={80}
                value={maxAge}
                onChange={(event) => setMaxAge(Math.max(clampAdultAge(Number(event.target.value)), minAge))}
                className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900"
              />
            </label>
            <label className="text-xs">
              Location
              <input
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="City or region"
                className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900"
              />
            </label>
            <label className="text-xs">
              Interest
              <input
                value={interestFilter}
                onChange={(event) => setInterestFilter(event.target.value)}
                placeholder="Music, hiking…"
                className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900"
              />
            </label>
          </div>
        </div>

        <Card
          className="relative mb-6 overflow-hidden shadow-2xl"
          onMouseDown={(event) => !actionPending && setDragStart(event.clientX)}
          onMouseUp={(event) => handleSwipeEnd(event.clientX)}
          onTouchStart={(event) => !actionPending && setDragStart(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) => handleSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}
        >
          <div className="relative h-96 overflow-hidden bg-gray-200">
            <img
              src={currentProfile.profileImageUrl}
              alt={`${currentProfile.displayName}'s profile`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute right-4 top-4 rounded-full bg-pink-500 px-4 py-2 text-right text-white">
              <div className="font-bold">{Math.round(Math.max(0, Math.min(100, currentProfile.compatibility)))}%</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-pink-100">service score</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="mb-2 text-3xl font-bold">
                {currentProfile.displayName}, {currentProfile.age}
              </h2>
              <p className="mb-4 text-pink-100">{currentProfile.location}</p>
              <p className="line-clamp-3 text-sm text-gray-200">{currentProfile.bio}</p>
            </div>
          </div>

          <div className="space-y-4 bg-white p-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Interests</p>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.length ? currentProfile.interests.map((interest) => (
                  <span key={interest} className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700">
                    {interest}
                  </span>
                )) : <span className="text-sm text-muted-foreground">No interests listed yet.</span>}
              </div>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <div className="flex items-center gap-2 text-violet-800">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-sm font-bold">Transparent connection signals</h3>
              </div>
              {savedDraft ? (
                connectionSignals.length ? (
                  <ul className="mt-2 space-y-1 text-sm text-violet-900/80">
                    {connectionSignals.map(signal => <li key={signal}>• {signal}</li>)}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-violet-900/70">
                    No exact interest or location overlap was found in your browser-session draft. The service score above is not an identity, safety, or relationship-outcome guarantee.
                  </p>
                )
              ) : (
                <p className="mt-2 text-sm leading-6 text-violet-900/70">
                  Save a profile draft to compare only the interests and general location you chose to share.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-slate-900">Conversation starters</h3>
              <div className="mt-2 grid gap-2">
                {conversationStarters.map(prompt => (
                  <div key={prompt} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <p className="mb-3 text-center text-sm text-white/80">
          Swipe right to like, left to pass, or use the buttons below.
        </p>

        <div className="mb-4 min-h-10" aria-live="polite">
          {actionError && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
              <span>{actionError}</span>
              {failedAction && (
                <Button size="sm" variant="outline" onClick={() => void runAction(failedAction)} disabled={Boolean(actionPending)}>
                  Retry
                </Button>
              )}
            </div>
          )}
          {!actionError && statusMessage && (
            <div className="rounded-xl bg-white/15 p-3 text-center text-sm font-medium text-white backdrop-blur">
              {statusMessage}
            </div>
          )}
        </div>

        <div className="mb-8 flex justify-center gap-6">
          <Button
            aria-label="Pass profile"
            onClick={() => void runAction('pass')}
            disabled={Boolean(actionPending)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-60"
          >
            {actionPending === 'pass' ? <Loader2 className="h-7 w-7 animate-spin text-gray-600" /> : <X className="h-8 w-8 text-gray-600" />}
          </Button>

          <Button
            aria-label="Super Like profile"
            onClick={() => void runAction('superlike')}
            disabled={Boolean(actionPending)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-lg hover:bg-blue-600 disabled:opacity-60"
          >
            {actionPending === 'superlike' ? <Loader2 className="h-7 w-7 animate-spin text-white" /> : <Star className="h-8 w-8 text-white" />}
          </Button>

          <Button
            aria-label="Like profile"
            onClick={() => void runAction('like')}
            disabled={Boolean(actionPending)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 shadow-lg hover:bg-pink-600 disabled:opacity-60"
          >
            {actionPending === 'like' ? <Loader2 className="h-7 w-7 animate-spin text-white" /> : <Heart className="h-8 w-8 text-white" />}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-white">
          <div className="rounded-lg bg-white/20 p-4">
            <div className="text-2xl font-bold">{liked.size}</div>
            <div className="text-sm">Likes</div>
          </div>
          <div className="rounded-lg bg-white/20 p-4">
            <div className="text-2xl font-bold">{superLiked.size}</div>
            <div className="text-sm">Super Likes</div>
          </div>
          <div className="rounded-lg bg-white/20 p-4">
            <div className="text-2xl font-bold">{decisions}</div>
            <div className="text-sm">Decisions</div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-white/70">
          Likes and passes are counted only after the server accepts the action. This engineering-beta screen does not claim identity verification or durable persistence beyond the existing API.
        </p>
      </div>
    </div>
  );
}
