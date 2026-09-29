import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import {
  Archive,
  Bot,
  Brain,
  Check,
  Clipboard,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  Loader2,
  Scale,
  MessageSquarePlus,
  Paperclip,
  Pin,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  buildHopeProviderContent,
  buildHopeProviderHistory,
  createHopeWorkspaceMessage,
  createHopeWorkspaceThread,
  exportHopeWorkspaceThread,
  normalizeHopeWorkspaceThreads,
  pinHopeWorkspaceArtifact,
  titleHopeWorkspaceThread,
  type HopeWorkspaceAttachment,
  type HopeWorkspaceMessage,
  type HopeWorkspaceThread,
} from "@/lib/hopeAIWorkspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY_PREFIX = "sky4444.hopeai.workspace.v1";

const storageKeyForUser = (userId: string): string =>
  STORAGE_KEY_PREFIX + ":" + encodeURIComponent(userId);

type WorkspaceMode = "general" | "build" | "learn" | "plan" | "legal";

const modeOptions: Array<{
  id: WorkspaceMode;
  label: string;
  icon: typeof Bot;
  agentId: string;
}> = [
  {
    id: "general",
    label: "General",
    icon: Bot,
    agentId: "general-assistant",
  },
  {
    id: "build",
    label: "Build",
    icon: Wrench,
    agentId: "software-engineer",
  },
  {
    id: "learn",
    label: "Learn",
    icon: GraduationCap,
    agentId: "tutor",
  },
  {
    id: "plan",
    label: "Plan",
    icon: Brain,
    agentId: "project-manager",
  },
  {
    id: "legal",
    label: "Lawyer",
    icon: Scale,
    agentId: "lawyer",
  },
];

const starterPrompts = [
  "Review my next SKYCOIN4444 engineering priority.",
  "Explain a difficult concept and quiz me on it.",
  "Turn this idea into a concrete implementation plan.",
  "Help me debug a TypeScript problem.",
];

const readStoredThreads = (storageKey: string): HopeWorkspaceThread[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    return normalizeHopeWorkspaceThreads(JSON.parse(raw));
  } catch {
    return [];
  }
};

export default function HopeAIWorkspace() {
  const { user, loading, isAuthenticated } = useAuth();
  const [threads, setThreads] = useState<HopeWorkspaceThread[]>(() => [
    createHopeWorkspaceThread(),
  ]);
  const [activeThreadId, setActiveThreadId] = useState("");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<WorkspaceMode>("general");
  const [selectedAgentId, setSelectedAgentId] = useState("general-assistant");
  const [selectedModel, setSelectedModel] = useState("");
  const [attachments, setAttachments] = useState<HopeWorkspaceAttachment[]>([]);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const storageKey = user?.id ? storageKeyForUser(user.id) : null;

  const models = trpc.ai.getModels.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const catalog = trpc.hopeAI.catalog.useQuery(undefined, {
    retry: false,
  });
  const agentRun = trpc.hopeAI.run.useMutation();

  useEffect(() => {
    if (!storageKey) {
      setLoadedStorageKey(null);
      return;
    }

    const stored = readStoredThreads(storageKey);
    const next = stored.length ? stored : [createHopeWorkspaceThread()];
    setThreads(next);
    setActiveThreadId(next[0].id);
    setInput("");
    setAttachments([]);
    setLoadedStorageKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || loadedStorageKey !== storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(threads));
    } catch {
      // Workspace remains usable in memory when local storage is unavailable.
    }
  }, [loadedStorageKey, storageKey, threads]);

  useEffect(() => {
    if (!selectedModel && models.data?.length) {
      setSelectedModel(models.data[0].id);
    }
  }, [models.data, selectedModel]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeThreadId, threads]);

  const activeThread = useMemo(
    () =>
      threads.find(thread => thread.id === activeThreadId) ??
      threads[0] ??
      null,
    [activeThreadId, threads]
  );

  const activeMode =
    modeOptions.find(option => option.id === mode) ?? modeOptions[0];

  const activeAgent = catalog.data?.agents.find(
    agent => agent.id === selectedAgentId
  );

  const updateThread = (
    threadId: string,
    updater: (thread: HopeWorkspaceThread) => HopeWorkspaceThread
  ) => {
    setThreads(current =>
      current.map(thread => (thread.id === threadId ? updater(thread) : thread))
    );
  };

  const newConversation = () => {
    const thread = createHopeWorkspaceThread();
    setThreads(current => [thread, ...current].slice(0, 30));
    setActiveThreadId(thread.id);
    setInput("");
    setAttachments([]);
  };

  const deleteConversation = (threadId: string) => {
    const remaining = threads.filter(thread => thread.id !== threadId);
    if (remaining.length) {
      setThreads(remaining);
      if (activeThreadId === threadId) setActiveThreadId(remaining[0].id);
      return;
    }

    const replacement = createHopeWorkspaceThread();
    setThreads([replacement]);
    setActiveThreadId(replacement.id);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const next: HopeWorkspaceAttachment[] = [];
    for (const file of Array.from(files).slice(0, 3 - attachments.length)) {
      const extension = file.name.toLowerCase().split(".").pop();
      if (!extension || !["txt", "md", "json", "csv"].includes(extension)) {
        toast.error(file.name + " is not a supported text attachment.");
        continue;
      }
      if (file.size > 64 * 1024) {
        toast.error(file.name + " is larger than the 64 KB beta limit.");
        continue;
      }

      try {
        const text = (await file.text()).slice(0, 8_000);
        next.push({
          id:
            "attachment-" +
            Date.now().toString(36) +
            "-" +
            next.length.toString(36),
          name: file.name,
          size: file.size,
          text,
        });
      } catch {
        toast.error("Could not read " + file.name + ".");
      }
    }

    if (next.length) {
      setAttachments(current => [...current, ...next].slice(0, 3));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || !activeThread || agentRun.isPending) return;

    const threadId = activeThread.id;
    const currentMessages = activeThread.messages;
    const sentAttachments = override ? [] : attachments;
    const userMessage = createHopeWorkspaceMessage({
      role: "user",
      content: text,
      attachments: sentAttachments,
    });

    updateThread(threadId, thread => ({
      ...thread,
      title:
        thread.messages.length === 0
          ? titleHopeWorkspaceThread(text)
          : thread.title,
      updatedAt: Date.now(),
      messages: [...thread.messages, userMessage].slice(-100),
    }));

    setInput("");
    setAttachments([]);

    try {
      const result = await agentRun.mutateAsync({
        agentId: selectedAgentId,
        message: buildHopeProviderContent(userMessage),
        history: buildHopeProviderHistory(currentMessages),
        ...(selectedModel ? { model: selectedModel } : {}),
      });

      const assistantMessage = createHopeWorkspaceMessage({
        role: "assistant",
        content: result.reply,
        model: result.model,
        agentName: result.agent.name,
        toolEvents: result.toolEvents,
      });

      updateThread(threadId, thread => ({
        ...thread,
        updatedAt: Date.now(),
        messages: [...thread.messages, assistantMessage].slice(-100),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI provider request failed.";
      toast.error(message);
    }
  };

  const exportConversation = () => {
    if (!activeThread) return;
    const text = exportHopeWorkspaceThread(activeThread);
    const element = document.createElement("a");
    element.href =
      "data:text/markdown;charset=utf-8," + encodeURIComponent(text);
    element.download =
      activeThread.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() +
      "-hopeai.md";
    element.click();
  };

  const copyMessage = async (message: HopeWorkspaceMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success("Copied.");
    } catch {
      toast.error("Clipboard access is unavailable.");
    }
  };

  const pinMessage = (message: HopeWorkspaceMessage) => {
    if (!activeThread) return;
    updateThread(activeThread.id, thread =>
      pinHopeWorkspaceArtifact(thread, message)
    );
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 text-foreground">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <Badge variant="outline">HopeAI Workspace</Badge>
          <h1 className="mt-4 text-3xl font-black">A real conversation workspace</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in to use the configured server-side AI provider. Conversations
            and pinned outputs are stored locally in this browser; this beta does
            not claim autonomous computer use, hidden memory, or background work.
          </p>
          <Link href="/signin">
            <Button className="mt-6 w-full">Open invitation sign in</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!storageKey || loadedStorageKey !== storageKey) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading your private HopeAI workspace…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1680px] lg:grid-cols-[260px_minmax(0,1fr)_310px]">
        <aside className="hidden border-r border-border bg-card/40 p-4 lg:flex lg:flex-col">
          <Button onClick={newConversation} className="w-full justify-start">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New chat
          </Button>

          <div className="mt-5 flex-1 space-y-1 overflow-y-auto">
            <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Conversations
            </p>
            {threads.map(thread => (
              <div
                key={thread.id}
                className={
                  "group flex items-center rounded-xl border px-2 py-1 " +
                  (thread.id === activeThread?.id
                    ? "border-primary/30 bg-primary/10"
                    : "border-transparent hover:border-border hover:bg-muted/40")
                }
              >
                <button
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  className="min-w-0 flex-1 px-2 py-2 text-left"
                >
                  <span className="block truncate text-sm font-medium">
                    {thread.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {thread.messages.length} messages
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteConversation(thread.id)}
                  className="rounded-md p-2 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={"Delete " + thread.title}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-background/50 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Tool-enabled agent runtime
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              HopeAI can call approved deterministic server tools and records
              which tools actually ran. External integrations stay gated until
              they are connected.
            </p>
          </div>
        </aside>

        <section className="flex min-h-screen min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="font-black">HopeAI</h1>
                    <p className="text-xs text-muted-foreground">
                      Agents + real tools + files
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={newConversation}
                  className="lg:hidden"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>

                <div className="flex items-center gap-1 lg:hidden">
                  <select
                    aria-label="Saved conversation"
                    value={activeThread?.id ?? ""}
                    onChange={event => setActiveThreadId(event.target.value)}
                    className="h-9 max-w-40 rounded-lg border border-border bg-card px-2 text-xs outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {threads.map(thread => (
                      <option key={thread.id} value={thread.id}>
                        {thread.title}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Delete current conversation"
                    onClick={() =>
                      activeThread && deleteConversation(activeThread.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <select
                  value={selectedModel}
                  onChange={event => setSelectedModel(event.target.value)}
                  className="h-9 max-w-48 rounded-lg border border-border bg-card px-3 text-xs outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label="AI model"
                >
                  {models.data?.length ? (
                    models.data.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))
                  ) : (
                    <option value="">
                      {models.isLoading ? "Loading models…" : "Provider default"}
                    </option>
                  )}
                </select>

                <select
                  value={selectedAgentId}
                  onChange={event => setSelectedAgentId(event.target.value)}
                  className="h-9 max-w-52 rounded-lg border border-border bg-card px-3 text-xs outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label="HopeAI specialist"
                >
                  {catalog.data?.agents.length ? (
                    catalog.data.agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))
                  ) : (
                    <option value="general-assistant">General Assistant</option>
                  )}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportConversation}
                  disabled={!activeThread?.messages.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {modeOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setMode(option.id);
                      setSelectedAgentId(option.agentId);
                    }}
                    className={
                      "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition " +
                      (mode === option.id
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground")
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto max-w-3xl">
              {!activeThread?.messages.length ? (
                <div className="grid min-h-[58vh] place-items-center py-10 text-center">
                  <div className="max-w-2xl">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="mt-6 text-3xl font-black tracking-tight">
                      What can HopeAI help you do?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                      This workspace uses the configured AI provider plus a
                      permissioned server-side tool runtime. Choose from
                      specialized agents, including Lawyer, engineering,
                      research, business, security, education, and many more.
                    </p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {starterPrompts.map(prompt => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="rounded-2xl border border-border bg-card p-4 text-left text-sm transition hover:border-primary/30 hover:bg-primary/[0.04]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-7">
                  {activeThread.messages.map(message => (
                    <article
                      key={message.id}
                      className={
                        message.role === "user"
                          ? "ml-auto max-w-[86%]"
                          : "max-w-full"
                      }
                    >
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        {message.role === "assistant" ? (
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>{message.role === "assistant" ? "HopeAI" : "You"}</span>
                        {message.agentName ? <span>· {message.agentName}</span> : null}
                        {message.model ? <span>· {message.model}</span> : null}
                      </div>

                      <div
                        className={
                          "rounded-2xl border px-4 py-3 " +
                          (message.role === "user"
                            ? "border-primary/20 bg-primary/10"
                            : "border-border bg-card/40")
                        }
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <Streamdown>{message.content}</Streamdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-6">
                            {message.content}
                          </p>
                        )}

                        {message.toolEvents?.length ? (
                          <div className="mt-3 rounded-xl border border-border bg-background/60 p-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                              Tool execution
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.toolEvents.map((event, index) => (
                                <Badge
                                  key={event.toolId + "-" + index}
                                  variant="outline"
                                  className={
                                    event.status === "success"
                                      ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                                      : "border-destructive/30 text-destructive"
                                  }
                                >
                                  {event.status === "success" ? "✓ " : "✕ "}
                                  {event.toolId}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {message.attachmentNames?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.attachmentNames.map(name => (
                              <Badge key={name} variant="outline">
                                <FileText className="mr-1 h-3 w-3" />
                                {name}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {message.role === "assistant" ? (
                        <div className="mt-2 flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyMessage(message)}
                          >
                            <Clipboard className="mr-2 h-3.5 w-3.5" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => pinMessage(message)}
                          >
                            <Pin className="mr-2 h-3.5 w-3.5" />
                            Pin
                          </Button>
                        </div>
                      ) : null}
                    </article>
                  ))}

                  {agentRun.isPending ? (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                      HopeAI agent is reasoning and may call approved tools…
                    </div>
                  ) : null}
                  <div ref={endRef} />
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-border bg-background/92 px-4 py-4 backdrop-blur-xl md:px-8">
            <div className="mx-auto max-w-3xl">
              {attachments.length ? (
                <div className="mb-2 flex flex-wrap gap-2">
                  {attachments.map(attachment => (
                    <Badge
                      key={attachment.id}
                      variant="outline"
                      className="gap-1 pr-1"
                    >
                      <FileText className="h-3 w-3" />
                      {attachment.name}
                      <button
                        type="button"
                        onClick={() =>
                          setAttachments(current =>
                            current.filter(item => item.id !== attachment.id)
                          )
                        }
                        className="ml-1 rounded p-1 hover:bg-muted"
                        aria-label={"Remove " + attachment.name}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="rounded-2xl border border-border bg-card p-2 shadow-xl">
                <Textarea
                  value={input}
                  onChange={event => setInput(event.target.value.slice(0, 8_000))}
                  onKeyDown={event => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder={
                    "Message " +
                    (activeAgent?.name ?? activeMode.label) +
                    "…"
                  }
                  className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center justify-between gap-2 px-1 pb-1">
                  <div className="flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.json,.csv,text/plain,text/markdown,application/json,text/csv"
                      multiple
                      className="hidden"
                      onChange={event => void handleFiles(event.target.files)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={attachments.length >= 3}
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      Add text file
                    </Button>
                    <span className="hidden text-[11px] text-muted-foreground sm:inline">
                      Enter to send · Shift+Enter for newline
                    </span>
                  </div>
                  <Button
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || agentRun.isPending}
                    size="sm"
                  >
                    {agentRun.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Verify important outputs. Files are read locally; the combined
                prompt and attachment context is capped at 8,000 characters per
                provider request.
              </p>
            </div>
          </div>
        </section>

        <aside className="hidden border-l border-border bg-card/30 p-4 xl:block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Agent workspace
              </p>
              <h2 className="mt-1 font-black">Tools + outputs</h2>
            </div>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">
                {activeAgent?.name ?? "General Assistant"}
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {activeAgent?.description ??
                "Specialized HopeAI agent with permissioned local tools."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">
                {catalog.data?.agentCount ?? "100+"} agents
              </Badge>
              <Badge variant="outline">
                {catalog.data?.executableToolCount ?? "many"} executable tools
              </Badge>
              <Badge variant="outline">
                {catalog.data?.toolCount ?? "many"} catalog tools
              </Badge>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {activeThread?.artifacts.length ? (
              activeThread.artifacts.map(artifact => (
                <div
                  key={artifact.id}
                  className="rounded-2xl border border-border bg-background/60 p-3"
                >
                  <div className="flex items-start gap-2">
                    <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <p className="line-clamp-2 text-sm font-semibold">
                      {artifact.title}
                    </p>
                  </div>
                  <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                    {artifact.content}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-7 px-2 text-xs"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(artifact.content);
                        toast.success("Pinned output copied.");
                      } catch {
                        toast.error("Clipboard access is unavailable.");
                      }
                    }}
                  >
                    <Clipboard className="mr-1 h-3 w-3" />
                    Copy
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 text-center">
                <FolderOpen className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">Nothing pinned yet</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Pin an assistant response to keep useful output beside the
                  conversation.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/60 p-4">
            <h3 className="font-semibold">Need the deterministic coach?</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              The original route-aware sprint planner is preserved separately.
              It works without an external model and uses bounded account-owned
              activity evidence.
            </p>
            <Link href="/hope-a-i-coach">
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Open HopeAI Coach
              </Button>
            </Link>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-200">
              Beta boundary
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Real local tools are enabled and auditable. Web browsing, email,
              GitHub writes, payments, wallet signing, cloud deployment, durable
              cloud memory, and computer-use automation remain unavailable until
              an explicit integration is connected and authorized.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
