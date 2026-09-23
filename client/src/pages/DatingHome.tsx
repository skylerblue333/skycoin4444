import { useEffect, useState } from "react";
import {
  Bell,
  Heart,
  MessageCircle,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRoundPen,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ExperienceShell,
  SurfaceCard,
} from "@/components/ecosystem/ExperienceShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const ADULT_CONFIRMATION_KEY = "sky4444.dating-adult-confirmed";

const safetyItems = [
  "Meet first dates in a public place.",
  "Control your own transportation.",
  "Do not send money, crypto, passwords, private keys, or recovery phrases.",
  "Block or report pressure, threats, impersonation, or suspected underage use.",
];

export default function DatingHome() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [adultConfirmed, setAdultConfirmed] = useState(false);

  useEffect(() => {
    try {
      setAdultConfirmed(sessionStorage.getItem(ADULT_CONFIRMATION_KEY) === "yes");
    } catch {
      setAdultConfirmed(false);
    }
  }, []);

  const summary = trpc.dating.summary.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const subscription = trpc.dating.subscription.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const confirmAdult = () => {
    setAdultConfirmed(true);
    try {
      sessionStorage.setItem(ADULT_CONFIRMATION_KEY, "yes");
    } catch {
      // The age gate remains in memory if browser-session storage is unavailable.
    }
  };

  if (!adultConfirmed) {
    return (
      <ExperienceShell
        title="SkyLife Dating"
        subtitle="Adults-only dating with real beta contracts and explicit safety boundaries."
        icon={Heart}
        accent="pink"
        badge="18+ engineering beta"
      >
        <div className="mx-auto max-w-2xl">
          <SurfaceCard className="p-7 md:p-10">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-pink-600">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
              Adults only
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              You must be at least 18 to use this dating area. This beta can
              store dating profiles, preferences, likes, mutual matches,
              messages, blocks, and reports for authenticated beta users. It
              does not provide document-based age or identity verification,
              background checks, precise location tracking, billing, or
              emergency response.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {safetyItems.map(item => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
            <Button
              onClick={confirmAdult}
              className="mt-7 w-full rounded-xl bg-pink-600 hover:bg-pink-700"
            >
              I confirm I am 18 or older
            </Button>
            <Link href="/beta-workspace">
              <Button variant="ghost" className="mt-2 w-full rounded-xl">
                Leave dating
              </Button>
            </Link>
          </SurfaceCard>
        </div>
      </ExperienceShell>
    );
  }

  const profileCreated = summary.data?.profileCreated ?? false;
  const matchCount = summary.data?.matchCount ?? 0;
  const unreadCount = summary.data?.unreadCount ?? 0;

  return (
    <ExperienceShell
      title="SkyLife Dating"
      subtitle="Profile → discovery → mutual match → conversation, with safety and privacy controls throughout."
      icon={Heart}
      accent="pink"
      badge="18+ engineering beta"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href="/dating-profile-setup">
            <Button variant="outline" className="rounded-xl">
              <UserRoundPen className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link href="/dating-discovery">
            <Button className="rounded-xl bg-pink-600 hover:bg-pink-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Discover
            </Button>
          </Link>
        </div>
      }
    >
      {!authLoading && !isAuthenticated ? (
        <SurfaceCard className="mb-5 border-amber-200 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-950">
            Sign in to use server-backed dating
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-900/75">
            Profile drafts can still be prepared locally, but discovery,
            preferences, matches, messaging, blocking, and reporting require an
            authenticated beta session.
          </p>
          <Link href="/signin">
            <Button className="mt-4 rounded-xl">Sign in</Button>
          </Link>
        </SurfaceCard>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          <Link href="/dating-profile-setup">
            <SurfaceCard className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-600">
                  <UserRoundPen className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {profileCreated ? "Created" : "Start here"}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-black text-slate-900">
                Build your profile
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add an adult profile, relationship intent, location, bio, and
                interests. Photos remain local until a real media-upload path is
                integrated.
              </p>
            </SurfaceCard>
          </Link>

          <Link href="/dating-discovery">
            <SurfaceCard className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-black text-slate-900">
                Discover adults
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use persisted age and gender preferences plus optional
                location/interest filters. Shared signals are factual overlap,
                not outcome predictions.
              </p>
            </SurfaceCard>
          </Link>

          <Link href="/dating-matches">
            <SurfaceCard className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-fuchsia-50 px-2.5 py-1 text-xs font-bold text-fuchsia-700">
                  {matchCount} match{matchCount === 1 ? "" : "es"}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-black text-slate-900">
                Matches & chat
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Messaging is available only after a mutual match and messages
                appear only after the server accepts them.
              </p>
            </SurfaceCard>
          </Link>

          <Link href="/dating-safety">
            <SurfaceCard className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-black text-slate-900">
                Safety center
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review scam warning signs, first-date safety practices, privacy
                controls, reporting boundaries, and a local date-safety plan.
              </p>
            </SurfaceCard>
          </Link>
        </div>

        <div className="space-y-5">
          <SurfaceCard className="p-5">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-pink-600" />
              <h2 className="font-black text-slate-900">Your dating status</h2>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <strong className="block text-xl text-slate-900">
                  {profileCreated ? "Yes" : "No"}
                </strong>
                <span className="text-xs text-slate-500">profile</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <strong className="block text-xl text-slate-900">
                  {matchCount}
                </strong>
                <span className="text-xs text-slate-500">matches</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <strong className="block text-xl text-slate-900">
                  {unreadCount}
                </strong>
                <span className="text-xs text-slate-500">unread</span>
              </div>
            </div>
            {summary.isError ? (
              <p className="mt-3 text-xs leading-5 text-red-600">
                Dating status could not be loaded. Your account may not be
                authenticated or the database may be unavailable.
              </p>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-violet-600" />
              <h2 className="font-black text-slate-900">Product boundaries</h2>
            </div>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <p>
                Billing/checkout:{" "}
                <strong>
                  {subscription.data?.billingConfigured ? "configured" : "not integrated"}
                </strong>
              </p>
              <p>Identity and age-document verification: not integrated.</p>
              <p>Background checks: not integrated.</p>
              <p>Precise-distance matching: not integrated.</p>
              <p>Emergency response: not provided by this beta.</p>
            </div>
            <Link href="/dating-premium">
              <Button variant="outline" className="mt-4 w-full rounded-xl">
                View premium concept
              </Button>
            </Link>
          </SurfaceCard>
        </div>
      </div>
    </ExperienceShell>
  );
}
