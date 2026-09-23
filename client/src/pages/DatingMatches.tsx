import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Heart,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserRoundPen,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/_core/hooks/useAuth";
import { DatingNotificationToast } from "@/components/DatingNotificationToast";

interface Match {
  id: number;
  user1Id: number;
  user2Id: number;
  matchType: "like" | "superlike" | "mutual_like" | "mutual_superlike";
  isMutual: boolean;
  lastMessageAt: string | null;
  createdAt: string;
  matchedUser?: {
    id: number;
    displayName: string;
    profileImageUrl: string;
    age: number;
  };
}

interface Message {
  id: number;
  matchId: number;
  senderId: number;
  recipientId: number;
  content: string;
  mediaUrl: string | null;
  mediaType: "image" | "video" | "audio" | null;
  readAt: string | null;
  createdAt: string;
}

const MAX_MESSAGE_LENGTH = 1000;

function safeRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return formatDistanceToNow(date, { addSuffix: true });
}

function isAdultMatchedUser(match: Match) {
  return !match.matchedUser || Number(match.matchedUser.age) >= 18;
}

export default function DatingMatches() {
  const { user } = useAuth();
  const parsedUserId = Number(user?.id);
  const currentUserId = Number.isFinite(parsedUserId) ? parsedUserId : null;
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  const loadMatches = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/dating/matches");
      if (!response.ok) {
        throw new Error(`Unable to load matches (${response.status}).`);
      }

      const data = (await response.json()) as { matches?: unknown };
      if (!Array.isArray(data.matches)) {
        throw new Error("The match service returned an invalid response.");
      }

      const safeMatches = (data.matches as Match[]).filter(isAdultMatchedUser);
      setMatches(safeMatches);
      setSelectedMatch(current =>
        current && safeMatches.some(match => match.id === current.id)
          ? current
          : safeMatches[0] ?? null,
      );
    } catch (error) {
      console.error("Failed to load matches:", error);
      setMatches([]);
      setSelectedMatch(null);
      setLoadError(
        error instanceof Error ? error.message : "Unable to load matches.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: number) => {
    setMessageLoading(true);
    setConversationError(null);

    try {
      const response = await fetch(`/api/dating/conversations/${matchId}`);
      if (!response.ok) {
        throw new Error(`Unable to load this conversation (${response.status}).`);
      }

      const data = (await response.json()) as { messages?: unknown };
      if (!Array.isArray(data.messages)) {
        throw new Error("The conversation service returned an invalid response.");
      }

      setMessages(data.messages as Message[]);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
      setConversationError(
        error instanceof Error ? error.message : "Unable to load this conversation.",
      );
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    void loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      void loadMessages(selectedMatch.id);
    } else {
      setMessages([]);
    }
  }, [selectedMatch]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (
      !content ||
      !selectedMatch ||
      currentUserId === null ||
      sending ||
      content.length > MAX_MESSAGE_LENGTH
    ) {
      return;
    }

    setSending(true);
    setSendError(null);
    setSendStatus(null);

    try {
      const response = await fetch("/api/dating/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          content,
        }),
      });

      if (!response.ok) {
        let detail = "";
        try {
          const body = (await response.json()) as { message?: unknown; error?: unknown };
          const candidate =
            typeof body.message === "string" ? body.message : body.error;
          detail = typeof candidate === "string" ? candidate.trim() : "";
        } catch {
          // The status code still gives the user a truthful failure state.
        }
        throw new Error(detail || `Message was not accepted (${response.status}).`);
      }

      setNewMessage("");
      setSendStatus("Message sent.");
      await loadMessages(selectedMatch.id);
      await loadMatches();
    } catch (error) {
      console.error("Failed to send message:", error);
      setSendError(
        error instanceof Error ? error.message : "Message could not be sent.",
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090404] text-white">
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <Spinner />
          Loading matches…
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#090404] px-4 py-8 text-white">
      <DatingNotificationToast />

      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-amber-200/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-100/70">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">
                Adult-only dating beta
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Matches & conversations
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Keep the journey connected: discover, match, message, and keep
              safety controls visible. Messages appear only after the server
              accepts them.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dating-profile-setup">
              <Button variant="outline" className="border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                <UserRoundPen className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            </Link>
            <Link href="/dating-discovery">
              <Button className="bg-pink-600 text-white hover:bg-pink-500">
                <Heart className="mr-2 h-4 w-4" />
                Discover
              </Button>
            </Link>
          </div>
        </header>

        {loadError ? (
          <Card className="mb-6 border-red-400/20 bg-red-400/[0.06] p-5 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                <div>
                  <h2 className="font-bold">Matches are unavailable</h2>
                  <p className="mt-1 text-sm text-red-100/70">{loadError}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => void loadMatches()} className="border-red-200/20 bg-white/[0.04] text-white">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </Card>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <Card className="border-white/10 bg-white/[0.035] p-4 text-white">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                    Your connections
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    {matches.length} match{matches.length === 1 ? "" : "es"}
                  </h2>
                </div>
                <MessageCircle className="h-5 w-5 text-pink-300" />
              </div>

              {matches.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-6 text-center">
                  <Heart className="mx-auto h-10 w-10 text-pink-300/60" />
                  <p className="mt-3 font-semibold">No matches yet</p>
                  <p className="mt-1 text-sm leading-6 text-white/45">
                    Discovery is the next step. A like alone is not represented
                    here as a mutual match.
                  </p>
                  <Link href="/dating-discovery">
                    <Button className="mt-4 w-full bg-pink-600 hover:bg-pink-500">
                      Open discovery
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.map(match => {
                    const selected = selectedMatch?.id === match.id;
                    const name = match.matchedUser?.displayName || "Match";
                    const age = match.matchedUser?.age;
                    return (
                      <button
                        type="button"
                        key={match.id}
                        disabled={sending}
                        onClick={() => setSelectedMatch(match)}
                        className={
                          "w-full rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 " +
                          (selected
                            ? "border-pink-300/35 bg-pink-400/[0.09]"
                            : "border-white/8 bg-black/20 hover:border-white/15 hover:bg-white/[0.04]")
                        }
                      >
                        <div className="flex items-center gap-3">
                          {match.matchedUser?.profileImageUrl ? (
                            <img
                              src={match.matchedUser.profileImageUrl}
                              alt={name}
                              className="h-12 w-12 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-400/15 text-lg font-black text-pink-200">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold">
                              {name}
                              {typeof age === "number" ? `, ${age}` : ""}
                            </p>
                            <p className="mt-1 truncate text-xs text-white/40">
                              {match.isMutual ? "Mutual match" : "Match"}
                              {match.lastMessageAt
                                ? ` · active ${safeRelativeTime(match.lastMessageAt)}`
                                : " · no messages yet"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="border-emerald-300/15 bg-emerald-300/[0.045] p-5 text-white">
              <div className="flex items-center gap-2 text-emerald-200">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="font-bold">Keep first meetings safer</h2>
              </div>
              <div className="mt-3 space-y-2 text-sm leading-6 text-white/55">
                <p>Meet in a public place and control your own transportation.</p>
                <p>Do not send money, crypto, passwords, private keys, or recovery phrases.</p>
                <p>Leave a conversation if someone pressures, threatens, or impersonates another person.</p>
              </div>
            </Card>
          </div>

          <Card className="flex min-h-[620px] flex-col overflow-hidden border-white/10 bg-white/[0.035] text-white">
            {selectedMatch ? (
              <>
                <div className="flex items-center justify-between gap-4 border-b border-white/8 p-5">
                  <div className="flex items-center gap-3">
                    {selectedMatch.matchedUser?.profileImageUrl ? (
                      <img
                        src={selectedMatch.matchedUser.profileImageUrl}
                        alt={selectedMatch.matchedUser.displayName}
                        className="h-11 w-11 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-400/15 font-black text-pink-200">
                        {(selectedMatch.matchedUser?.displayName || "M")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className="font-black">
                        {selectedMatch.matchedUser?.displayName || "Match"}
                        {typeof selectedMatch.matchedUser?.age === "number"
                          ? `, ${selectedMatch.matchedUser.age}`
                          : ""}
                      </h2>
                      <p className="text-xs text-white/40">
                        {selectedMatch.isMutual
                          ? "Mutual match · message at your pace"
                          : "Match · message at your pace"}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                    No online-status claim
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  {messageLoading ? (
                    <div className="grid h-full place-items-center">
                      <div className="flex items-center gap-2 text-sm text-white/55">
                        <Spinner /> Loading conversation…
                      </div>
                    </div>
                  ) : conversationError ? (
                    <div className="grid h-full place-items-center">
                      <div className="max-w-md rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-5 text-center">
                        <AlertTriangle className="mx-auto h-8 w-8 text-red-300" />
                        <p className="mt-3 font-bold">Conversation unavailable</p>
                        <p className="mt-2 text-sm text-white/50">
                          {conversationError}
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 border-white/10 bg-white/[0.04] text-white"
                          onClick={() => void loadMessages(selectedMatch.id)}
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="grid h-full place-items-center">
                      <div className="max-w-md text-center">
                        <MessageCircle className="mx-auto h-12 w-12 text-pink-300/55" />
                        <h3 className="mt-4 text-xl font-black">Start with something specific</h3>
                        <p className="mt-2 text-sm leading-6 text-white/45">
                          Ask about an interest from their profile rather than
                          opening with a generic line. Respect a no or no reply.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(message => {
                        const mine = message.senderId === currentUserId;
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
                                {safeRelativeTime(message.createdAt)}
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
                    {sendError ? (
                      <span className="text-red-300">{sendError}</span>
                    ) : sendStatus ? (
                      <span className="text-emerald-300">{sendStatus}</span>
                    ) : (
                      <span className="text-white/30">
                        {newMessage.length}/{MAX_MESSAGE_LENGTH} · server-confirmed send · conversation locked while sending
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      maxLength={MAX_MESSAGE_LENGTH}
                      disabled={sending}
                      onChange={event => {
                        setNewMessage(event.target.value);
                        setSendError(null);
                        setSendStatus(null);
                      }}
                      onKeyDown={event => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          void handleSendMessage();
                        }
                      }}
                      placeholder="Write a respectful message…"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => void handleSendMessage()}
                      disabled={
                        !newMessage.trim() ||
                        currentUserId === null ||
                        sending ||
                        newMessage.trim().length > MAX_MESSAGE_LENGTH
                      }
                      className="bg-pink-600 hover:bg-pink-500"
                    >
                      {sending ? <Spinner className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <MessageCircle className="mx-auto h-14 w-14 text-white/20" />
                  <h2 className="mt-4 text-xl font-black">Choose a match</h2>
                  <p className="mt-2 text-sm text-white/45">
                    Select a server-returned match to open its conversation.
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
