import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Loader2,
  MessageCircle,
  Search,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";

function formatTimestamp(value: Date | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default function Messages() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);
  const [recipientUsername, setRecipientUsername] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();

  const inboxQuery = trpc.dm.inbox.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 15_000,
  });
  const threadQuery = trpc.dm.thread.useQuery(
    { participantId: selectedParticipantId ?? "" },
    { enabled: Boolean(selectedParticipantId), refetchInterval: 10_000 }
  );
  const markThreadRead = trpc.dm.markThreadRead.useMutation({
    onSuccess: () => void utils.dm.inbox.invalidate(),
  });
  const sendMessage = trpc.dm.send.useMutation({
    onSuccess: result => {
      setSelectedParticipantId(result.recipient.id);
      setRecipientUsername("");
      setContent("");
      void utils.dm.inbox.invalidate();
      void utils.dm.thread.invalidate({ participantId: result.recipient.id });
    },
    onError: error => toast.error(error.message),
  });
  const deleteMessage = trpc.dm.deleteOwn.useMutation({
    onSuccess: () => {
      if (selectedParticipantId)
        void utils.dm.thread.invalidate({
          participantId: selectedParticipantId,
        });
      void utils.dm.inbox.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  useEffect(() => {
    if (selectedParticipantId) {
      markThreadRead.mutate({ participantId: selectedParticipantId });
    }
  }, [selectedParticipantId]);

  const conversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (inboxQuery.data ?? []).filter(conversation => {
      const displayName =
        conversation.participant.name ||
        conversation.participant.username ||
        "";
      return (
        !normalizedSearch ||
        displayName.toLowerCase().includes(normalizedSearch) ||
        conversation.participant.username
          ?.toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [inboxQuery.data, search]);

  const selectedConversation = (inboxQuery.data ?? []).find(
    conversation => conversation.participant.id === selectedParticipantId
  );
  const selectedDisplayName =
    selectedConversation?.participant.name ||
    selectedConversation?.participant.username ||
    "Message thread";

  const send = () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;
    if (selectedParticipantId) {
      sendMessage.mutate({
        recipientId: selectedParticipantId,
        content: trimmedContent,
      });
      return;
    }
    if (!recipientUsername.trim()) {
      toast.error("Enter a recipient username before sending a message.");
      return;
    }
    sendMessage.mutate({
      recipientUsername: recipientUsername.trim(),
      content: trimmedContent,
    });
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <Loader2
          className="h-6 w-6 animate-spin"
          aria-label="Loading messages"
        />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <Card className="max-w-md border-slate-700 bg-slate-900 text-center">
          <CardContent className="p-8">
            <UserRound className="mx-auto h-10 w-10 text-sky-300" />
            <h1 className="mt-4 text-xl font-semibold">
              Sign in to use direct messages
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Messages are stored by the platform and are not represented as
              end-to-end encrypted.
            </p>
            <Link href="/">
              <Button className="mt-6">Return home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 lg:grid-cols-[21rem_1fr]">
        <aside className="border-b border-slate-700 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-700 p-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <p className="mt-1 text-xs text-slate-400">
              Stored direct messages; encryption is not configured.
            </p>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search conversations"
                className="border-slate-700 bg-slate-950 pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[24rem] lg:h-[calc(100vh-12rem)]">
            {inboxQuery.isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                No stored conversations yet.
              </div>
            ) : (
              <div className="p-2">
                {conversations.map(conversation => {
                  const displayName =
                    conversation.participant.name ||
                    conversation.participant.username ||
                    "Unnamed user";
                  return (
                    <button
                      key={conversation.participant.id}
                      onClick={() =>
                        setSelectedParticipantId(conversation.participant.id)
                      }
                      className={`mb-1 w-full rounded-lg p-3 text-left transition-colors ${selectedParticipantId === conversation.participant.id ? "bg-sky-500/15" : "hover:bg-slate-800"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-medium text-white">
                          {displayName}
                        </span>
                        {conversation.unreadCount > 0 ? (
                          <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
                            {conversation.unreadCount}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {conversation.lastMessage || "No message content"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatTimestamp(conversation.lastMessageAt)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </aside>

        <section className="flex min-h-[32rem] flex-col">
          <header className="border-b border-slate-700 p-4">
            <h2 className="font-semibold text-white">
              {selectedParticipantId
                ? selectedDisplayName
                : "New direct message"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Only persisted messages are shown. Media, calls, reactions, and
              encrypted messaging are unavailable.
            </p>
          </header>

          <ScrollArea className="flex-1 p-4">
            {!selectedParticipantId ? (
              <div className="flex h-full min-h-56 flex-col items-center justify-center text-center">
                <MessageCircle className="h-10 w-10 text-slate-600" />
                <h3 className="mt-4 font-medium">Start a direct message</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Enter a recipient username and a message below. The recipient
                  must already have a username recorded on the platform.
                </p>
              </div>
            ) : threadQuery.isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : threadQuery.isError ? (
              <div className="text-center text-sm text-red-300">
                {threadQuery.error.message}
              </div>
            ) : (threadQuery.data ?? []).length === 0 ? (
              <div className="flex h-full min-h-56 flex-col items-center justify-center text-center">
                <MessageCircle className="h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">
                  No messages in this thread yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(threadQuery.data ?? []).map(message => {
                  const isOwnMessage = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${isOwnMessage ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-100"}`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-4 text-xs opacity-75">
                          <span>{formatTimestamp(message.createdAt)}</span>
                          {isOwnMessage ? (
                            <button
                              onClick={() =>
                                deleteMessage.mutate({ messageId: message.id })
                              }
                              disabled={deleteMessage.isPending}
                              className="inline-flex items-center gap-1 hover:opacity-100"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <form
            onSubmit={event => {
              event.preventDefault();
              send();
            }}
            className="border-t border-slate-700 p-4"
          >
            {!selectedParticipantId ? (
              <Input
                value={recipientUsername}
                onChange={event => setRecipientUsername(event.target.value)}
                placeholder="Recipient username"
                className="mb-3 border-slate-700 bg-slate-950"
              />
            ) : null}
            <div className="flex gap-2">
              <Input
                value={content}
                onChange={event => setContent(event.target.value)}
                placeholder="Write a message"
                maxLength={255}
                className="border-slate-700 bg-slate-950"
              />
              <Button
                type="submit"
                disabled={!content.trim() || sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
