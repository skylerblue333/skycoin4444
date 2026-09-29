import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Bot, CheckCircle2, Copy, MessageCircle, ShieldCheck, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const MAX_DRAFT_LENGTH = 4_000;

export default function UnifiedMessaging() {
  const { isAuthenticated } = useAuth();
  const [draft, setDraft] = useState("");

  const trimmedDraft = draft.trim();
  const charactersRemaining = MAX_DRAFT_LENGTH - draft.length;
  const canCopy = trimmedDraft.length > 0;
  const hopeAIHref = canCopy
    ? "/hope-a-i?source=messaging&prompt=" + encodeURIComponent(trimmedDraft)
    : "/hope-a-i";

  const boundaryItems = useMemo(
    () => [
      "No remote message is sent from this screen.",
      "No realtime transport, delivery receipt, presence, push notification, or cross-device persistence is claimed.",
      "Automatic translation and end-to-end encryption are not enabled on this flagship beta route.",
      "Use Social for persisted community activity and HopeAI for assistant-supported drafting while messaging transport is completed.",
    ],
    []
  );

  async function copyDraft() {
    if (!canCopy) return;
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(trimmedDraft);
      toast.success("Message draft copied");
    } catch {
      toast.error("Clipboard access is unavailable in this browser");
    }
  }

  function clearDraft() {
    setDraft("");
    toast.success("Draft cleared");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/60 to-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-violet-300/15 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-violet-400/15 text-violet-100">MESSAGING BETA</Badge>
              <Badge variant="outline" className="border-amber-300/25 text-amber-100">
                Transport not connected
              </Badge>
            </div>
            <h1 className="mt-4 flex items-center gap-3 text-3xl font-black tracking-tight sm:text-4xl">
              <MessageCircle className="h-8 w-8 text-violet-300" />
              Unified Messaging
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
              A truthful engineering-beta workspace for preparing messages and moving between Chat,
              Social, and HopeAI without pretending that an unfinished realtime backend is already live.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/activity-feed"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Users className="h-4 w-4" />
              Open Social
            </Link>
            <Link
              href={hopeAIHref}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/[0.08] px-4 py-2 text-sm font-bold text-violet-100 transition hover:bg-violet-300/[0.14]"
            >
              <Bot className="h-4 w-4" />
              {canCopy ? "Polish with HopeAI" : "Draft with HopeAI"}
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="border-white/10 bg-slate-950/55 text-white">
            <CardHeader>
              <CardTitle>Message draft</CardTitle>
              <CardDescription className="text-white/45">
                This editor is local to the current page session. Copy the draft when you are ready
                to move it into a connected communication channel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                aria-label="Message draft"
                value={draft}
                maxLength={MAX_DRAFT_LENGTH}
                onChange={event => setDraft(event.target.value)}
                placeholder="Write a message, outreach note, language-exchange reply, or community update…"
                className="min-h-64 border-white/10 bg-white/[0.035] text-white placeholder:text-white/25"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/35">
                  {charactersRemaining.toLocaleString()} characters remaining · nothing is transmitted automatically
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearDraft}
                    disabled={!draft}
                    className="border-white/10 bg-transparent text-white/65 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    type="button"
                    onClick={copyDraft}
                    disabled={!canCopy}
                    className="bg-violet-500 text-white hover:bg-violet-400"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy draft
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] p-4">
                <p className="text-sm font-black text-amber-100">Remote send is intentionally unavailable here.</p>
                <p className="mt-1 text-xs leading-5 text-amber-50/55">
                  The previous flagship screen used hard-coded conversations and simulated replies.
                  This beta now fails closed until authenticated transport, durable storage, participant
                  authorization, moderation, and delivery evidence are integrated.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-emerald-300/15 bg-emerald-300/[0.04] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  Capability boundary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {boundaryItems.map(item => (
                  <div key={item} className="flex gap-2 text-sm leading-5 text-white/55">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/80" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.025] text-white">
              <CardHeader>
                <CardTitle className="text-base">Account path</CardTitle>
                <CardDescription className="text-white/40">
                  Authenticated messaging remains a launch integration task rather than a simulated success.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <p className="text-sm leading-6 text-white/55">
                    Your beta session is active. The remaining work is a real participant-aware messaging
                    adapter with durable storage and transport evidence.
                  </p>
                ) : (
                  <Link
                    href="/signin"
                    className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-950"
                  >
                    Sign in to the beta
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
