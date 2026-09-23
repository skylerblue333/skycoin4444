import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  Flag,
  Heart,
  Loader2,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserRoundPen,
  XCircle,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { buildConversationStarters } from "@/lib/datingExperience";

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

function relativeLabel(value: Date | string | null | undefined) {
  if (!value) return "no messages yet";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "recent activity";
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60_000)
  );
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DatingMatches() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const matchesQuery = trpc.dating.matches.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [reportReason, setReportReason] =
    useState<ReportReason>("unsafe_behavior");
  const [reportDetails, setReportDetails] = useState("");
  const [blockAfterReport, setBlockAfterReport] = useState(true);

  const matches = matchesQuery.data ?? [];

  useEffect(() => {
    if (!matches.length) {
      setSelectedMatchId(null);
      return;
    }
    if (
      !selectedMatchId ||
      !matches.some(match => match.id === selectedMatchId)
    ) {
      setSelectedMatchId(matches[0].id);
    }
  }, [matches, selectedMatchId]);

  const selectedMatch =
    matches.find(match => match.id === selectedMatchId) ?? null;

  const conversation = trpc.dating.conversation.useQuery(
    { matchId: selectedMatchId ?? "" },
    {
      enabled: Boolean(isAuthenticated && selectedMatchId),
      retry: false,
    }
  );

  const starters = useMemo(
    () =>
      selectedMatch
        ? buildConversationStarters({
            displayName: selectedMatch.matchedUser.displayName,
            location: selectedMatch.matchedUser.location,
            bio: "",
            interests: selectedMatch.matchedUser.interests,
          })
        : [],
    [selectedMatch]
  );

  const refreshInbox = async () => {
    await Promise.all([
      utils.dating.matches.invalidate(),
      utils.dating.summary.invalidate(),
      utils.dating.notifications.invalidate(),
    ]);
    if (selectedMatchId) {
      await utils.dating.conversation.invalidate({ matchId: selectedMatchId });
    }
  };

  const sendMessage = trpc.dating.sendMessage.useMutation({
    onSuccess: async () => {
      setNewMessage("");
      setStatusMessage("Message accepted by the server.");
      await refreshInbox();
    },
  });

  const unmatch = trpc.dating.unmatch.useMutation({
    onSuccess: async result => {
      setSafetyOpen(false);
      setStatusMessage(result.message);
      setSelectedMatchId(null);
      await refreshInbox();
    },
  });

  const block = trpc.dating.block.useMutation({
    onSuccess: async () => {
      setSafetyOpen(false);
      setStatusMessage("Profile blocked and active dating connection closed.");
      setSelectedMatchId(null);
      await refreshInbox();
    },
  });

  const report = trpc.dating.report.useMutation({
    onSuccess: async result => {
      setSafetyOpen(false);
      setReportDetails("");
      setStatusMessage(result.message);
      if (result.blocked) setSelectedMatchId(null);
      await refreshInbox();
    },
  });

  const send = () => {
    const content = newMessage.trim();
    if (!selectedMatchId || !content || sendMessage.isPending) return;
    setStatusMessage(null);
    sendMessage.mutate({ matchId: selectedMatchId, content });
  };

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090404] text-white">
        <Loader2 className="h-6 w-6 animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090404] p-4 text-white">
        <Card className="w-full max-w-lg border-white/10 bg-white/[0.04] p-7 text-center text-white">
          <ShieldCheck className="mx-auto h-12 w-12 text-pink-300" />
          <h1 className="mt-4 text-2xl font-black">Sign in to open matches</h1>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Matches and messages are tied to the authenticated beta account.
          </p>
          <Link href="/signin">
            <Button className="mt-5">Sign in</Button>
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
                Mutual matches only
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Matches & conversations
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Conversation access is authorized by an active mutual match.
              Sending is server-confirmed; block, report, and unmatch controls
              close the active dating connection.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dating-profile-setup">
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
              >
                <UserRoundPen className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/dating-discovery">
              <Button className="bg-pink-600 hover:bg-pink-500">
                <Heart className="mr-2 h-4 w-4" />
                Discover
              </Button>
            </Link>
          </div>
        </header>

        {matchesQuery.isError ? (
          <Card className="mb-5 border-red-400/20 bg-red-400/[0.06] p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-black">Matches could not load</h2>
                <p className="mt-1 text-sm text-white/50">
                  {matchesQuery.error.message}
                </p>
              </div>
              <Button onClick={() => void matchesQuery.refetch()}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </Card>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <Card className="border-white/10 bg-white/[0.04] p-4 text-white">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                    Connections
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    {matches.length} match{matches.length === 1 ? "" : "es"}
                  </h2>
                </div>
                <MessageCircle className="h-5 w-5 text-pink-300" />
              </div>

              {matchesQuery.isLoading ? (
                <div className="flex items-center justify-center py-10 text-white/45">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading…
                </div>
              ) : matches.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-6 text-center">
                  <Heart className="mx-auto h-10 w-10 text-pink-300/50" />
                  <p className="mt-3 font-bold">No mutual matches yet</p>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    A one-sided like is not shown as a match. Continue discovery
                    and a conversation appears only after reciprocal interest.
                  </p>
                  <Link href="/dating-discovery">
                    <Button className="mt-4 bg-pink-600 hover:bg-pink-500">
                      Open discovery
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.map(match => {
                    const selected = selectedMatchId === match.id;
                    return (
                      <button
                        key={match.id}
                        type="button"
                        disabled={sendMessage.isPending}
                        onClick={() => {
                          setSelectedMatchId(match.id);
                          setSafetyOpen(false);
                          setStatusMessage(null);
                        }}
                        className={
                          "w-full rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 " +
                          (selected
                            ? "border-pink-300/30 bg-pink-400/[0.09]"
                            : "border-white/8 bg-black/20 hover:border-white/15 hover:bg-white/[0.04]")
                        }
                      >
                        <div className="flex items-center gap-3">
                          {match.matchedUser.profileImageUrl ? (
                            <img
                              src={match.matchedUser.profileImageUrl}
                              alt={match.matchedUser.displayName}
                              className="h-12 w-12 rounded-2xl object-cover"
                            />
                          ) : (
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-400/15 text-lg font-black text-pink-200">
                              {match.matchedUser.displayName
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-black">
                              {match.matchedUser.displayName},{" "}
                              {match.matchedUser.age}
                            </p>
                            <p className="mt-1 truncate text-xs text-white/35">
                              {match.lastMessageAt
                                ? `active ${relativeLabel(match.lastMessageAt)}`
                                : "no messages yet"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="border-emerald-300/15 bg-emerald-300/[0.05] p-5 text-white">
              <div className="flex items-center gap-2 text-emerald-200">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="font-black">Messaging safety</h2>
              </div>
              <div className="mt-3 space-y-2 text-sm leading-6 text-white/55">
                <p>Never send passwords, private keys, or recovery phrases.</p>
                <p>Be cautious with money, crypto, gift-card, or secrecy requests.</p>
                <p>Move at your own pace and respect a no, silence, or boundary.</p>
              </div>
              <Link href="/dating-safety">
                <Button
                  variant="outline"
                  className="mt-4 w-full border-white/10 bg-white/[0.03] text-white"
                >
                  Open safety center
                </Button>
              </Link>
            </Card>
          </div>

          <Card className="flex min-h-[650px] flex-col overflow-hidden border-white/10 bg-white/[0.04] text-white">
            {selectedMatch ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-5">
                  <div className="flex items-center gap-3">
                    {selectedMatch.matchedUser.profileImageUrl ? (
                      <img
                        src={selectedMatch.matchedUser.profileImageUrl}
                        alt={selectedMatch.matchedUser.displayName}
                        className="h-12 w-12 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-400/15 font-black text-pink-200">
                        {selectedMatch.matchedUser.displayName
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                    <div>
                      <h2 className="font-black">
                        {selectedMatch.matchedUser.displayName},{" "}
                        {selectedMatch.matchedUser.age}
                      </h2>
                      <p className="text-xs text-white/35">
                        Mutual match · no online-status claim
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/10 bg-white/[0.03] text-white"
                    onClick={() => setSafetyOpen(value => !value)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Safety
                  </Button>
                </div>

                {safetyOpen ? (
                  <div className="border-b border-amber-200/10 bg-amber-200/[0.04] p-5">
                    <p className="text-xs leading-5 text-amber-100/60">
                      Unmatch closes conversation access. Block also removes the
                      active dating connection. Reports are stored as pending
                      review and are not emergency response.
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
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
                        placeholder="Optional report details"
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
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="border-white/10 bg-white/[0.03] text-white"
                        disabled={unmatch.isPending}
                        onClick={() =>
                          unmatch.mutate({ matchId: selectedMatch.id })
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Unmatch
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 bg-white/[0.03] text-white"
                        disabled={block.isPending}
                        onClick={() =>
                          block.mutate({
                            userId: selectedMatch.matchedUser.id,
                            reason: "blocked from active match",
                          })
                        }
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Block
                      </Button>
                      <Button
                        className="bg-amber-600 hover:bg-amber-500"
                        disabled={report.isPending}
                        onClick={() =>
                          report.mutate({
                            userId: selectedMatch.matchedUser.id,
                            reason: reportReason,
                            details: reportDetails || undefined,
                            blockAfterReport,
                          })
                        }
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="flex-1 overflow-y-auto p-5">
                  {conversation.isLoading ? (
                    <div className="grid h-full place-items-center text-white/45">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : conversation.isError ? (
                    <div className="grid h-full place-items-center">
                      <div className="max-w-md text-center">
                        <AlertTriangle className="mx-auto h-10 w-10 text-red-300" />
                        <h3 className="mt-3 font-black">
                          Conversation unavailable
                        </h3>
                        <p className="mt-2 text-sm text-white/50">
                          {conversation.error.message}
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => void conversation.refetch()}
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : !conversation.data?.length ? (
                    <div className="grid h-full place-items-center">
                      <div className="max-w-xl text-center">
                        <MessageCircle className="mx-auto h-12 w-12 text-pink-300/50" />
                        <h3 className="mt-4 text-xl font-black">
                          Start with something specific
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/45">
                          Use something they actually chose to share instead of
                          a generic opener.
                        </p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          {starters.map(starter => (
                            <button
                              key={starter}
                              type="button"
                              onClick={() =>
                                setNewMessage(starter.slice(0, 255))
                              }
                              className="rounded-xl border border-white/8 bg-black/20 p-3 text-left text-sm text-white/60 transition hover:border-pink-300/20"
                            >
                              {starter}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.data.map(message => {
                        const mine = message.senderId === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={mine ? "flex justify-end" : "flex justify-start"}
                          >
                            <div
                              className={
                                "max-w-[82%] rounded-2xl px-4 py-3 " +
                                (mine
                                  ? "bg-pink-600 text-white"
                                  : "border border-white/8 bg-black/25 text-white/85")
                              }
                            >
                              <p className="whitespace-pre-wrap text-sm leading-6">
                                {message.content}
                              </p>
                              <p className="mt-1 text-[10px] opacity-60">
                                {relativeLabel(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/8 p-4">
                  <div className="mb-2 min-h-5 text-xs" aria-live="polite">
                    {sendMessage.isError ? (
                      <span className="text-red-300">
                        {sendMessage.error.message}
                      </span>
                    ) : unmatch.isError ? (
                      <span className="text-red-300">{unmatch.error.message}</span>
                    ) : block.isError ? (
                      <span className="text-red-300">{block.error.message}</span>
                    ) : report.isError ? (
                      <span className="text-red-300">{report.error.message}</span>
                    ) : statusMessage ? (
                      <span className="text-emerald-300">{statusMessage}</span>
                    ) : (
                      <span className="text-white/30">
                        {newMessage.length}/255 · conversation selection is
                        locked while a send is in flight
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      maxLength={255}
                      disabled={sendMessage.isPending}
                      onChange={event => {
                        setNewMessage(event.target.value);
                        setStatusMessage(null);
                      }}
                      onKeyDown={event => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          send();
                        }
                      }}
                      placeholder="Write a respectful message…"
                      className="flex-1"
                    />
                    <Button
                      onClick={send}
                      disabled={!newMessage.trim() || sendMessage.isPending}
                      className="bg-pink-600 hover:bg-pink-500"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageCircle className="h-4 w-4" />
                      )}
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <MessageCircle className="mx-auto h-14 w-14 text-white/20" />
                  <h2 className="mt-4 text-xl font-black">
                    Choose a mutual match
                  </h2>
                  <p className="mt-2 text-sm text-white/45">
                    Select a match to open the server-backed conversation.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
