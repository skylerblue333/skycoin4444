/*
 * Production-shaped community beta surface: real public data and authorized
 * writes through tRPC. Keep claims evidence-based; never invent user activity.
 */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessageSquare, Plus, ShieldCheck } from "lucide-react";

export default function CommunityHub() {
  const { isAuthenticated, loading } = useAuth();
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadBody, setThreadBody] = useState("");

  const communities = trpc.community.list.useQuery({ limit: 30 });
  const selected = communities.data?.find((community) => community.id === selectedCommunityId) ?? communities.data?.[0];
  const threads = trpc.community.threads.useQuery(
    { communityId: selected?.id ?? "", limit: 30 },
    { enabled: Boolean(selected?.id) },
  );
  const utils = trpc.useUtils();
  const createCommunity = trpc.community.create.useMutation({
    onSuccess: async (created) => {
      setName(""); setDescription(""); setSelectedCommunityId(created.id);
      await utils.community.list.invalidate();
    },
  });
  const joinCommunity = trpc.community.join.useMutation({
    onSuccess: () => utils.community.list.invalidate(),
  });
  const createThread = trpc.community.createThread.useMutation({
    onSuccess: async () => {
      setThreadTitle(""); setThreadBody("");
      await utils.community.threads.invalidate({ communityId: selected?.id ?? "", limit: 30 });
    },
  });

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-3">Skycoin community beta</Badge>
            <h1 className="text-3xl font-bold tracking-tight">Build in public, with guardrails.</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Public communities and moderated discussion backed by real records. No fabricated activity, engagement counts, or testimonials are shown.</p>
          </div>
          {!isAuthenticated && <Button onClick={() => startLogin()}>Sign in to participate</Button>}
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Public communities</CardTitle><CardDescription>Select a community to inspect its public threads.</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {communities.isLoading && <p className="text-sm text-muted-foreground">Loading communities…</p>}
                {!communities.isLoading && !communities.data?.length && <p className="text-sm text-muted-foreground">No public communities have been created yet.</p>}
                {communities.data?.map((community) => (
                  <button type="button" key={community.id} onClick={() => setSelectedCommunityId(community.id)} className="w-full text-left">
                    <div className={`rounded-lg border p-3 transition-colors hover:border-primary ${selected?.id === community.id ? "border-primary bg-primary/5" : "border-border/60"}`}>
                      <div className="flex items-start justify-between gap-2"><span className="font-medium">{community.name}</span><Badge variant="outline">{community.memberCount ?? 0} members</Badge></div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{community.description || "No description provided."}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{community.category}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {isAuthenticated && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" />Create a community</CardTitle><CardDescription>Start a public space with a clear purpose.</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Community name" maxLength={120} />
                  <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What belongs here?" maxLength={255} />
                  <Button disabled={name.trim().length < 2 || createCommunity.isPending} onClick={() => createCommunity.mutate({ name: name.trim(), description: description.trim() || null, category: "Skycoin", visibility: "public" })}>{createCommunity.isPending ? "Creating…" : "Create community"}</Button>
                </CardContent>
              </Card>
            )}
          </section>

          <section>
            {!selected && <Card className="p-10 text-center"><MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 text-xl font-semibold">Choose a community</h2><p className="mt-2 text-muted-foreground">Public discussion will appear here once a community exists.</p></Card>}
            {selected && <div className="space-y-6">
              <Card>
                <CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle>{selected.name}</CardTitle><CardDescription className="mt-1">{selected.description || "No description provided."}</CardDescription></div>{isAuthenticated && !selected.joined && <Button onClick={() => joinCommunity.mutate({ communityId: selected.id })} disabled={joinCommunity.isPending}>{joinCommunity.isPending ? "Joining…" : "Join community"}</Button>}{selected.joined && <Badge><ShieldCheck className="mr-1 h-3 w-3" />Joined</Badge>}</div></CardHeader>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Discussion</CardTitle><CardDescription>{threads.isLoading ? "Loading threads…" : `${threads.data?.length ?? 0} public threads`}</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  {!threads.isLoading && !threads.data?.length && <p className="py-6 text-sm text-muted-foreground">No threads yet. Join this community to start the first one.</p>}
                  {threads.data?.map((thread) => <article key={thread.id} className="rounded-lg border border-border/60 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold">{thread.title}</h3><Badge variant="outline">{thread.replyCount ?? 0} replies</Badge></div><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{thread.body}</p><p className="mt-3 text-xs text-muted-foreground">by {thread.authorName || thread.authorUsername || "community member"}</p></article>)}
                </CardContent>
              </Card>
              {isAuthenticated && selected.joined && <Card><CardHeader><CardTitle>Start a thread</CardTitle><CardDescription>Write a concrete question, proposal, or build note.</CardDescription></CardHeader><CardContent className="space-y-3"><Input value={threadTitle} onChange={(event) => setThreadTitle(event.target.value)} placeholder="Thread title" maxLength={160} /><Textarea value={threadBody} onChange={(event) => setThreadBody(event.target.value)} placeholder="What should the community discuss?" maxLength={10000} /><Button disabled={threadTitle.trim().length < 3 || threadBody.trim().length < 1 || createThread.isPending} onClick={() => createThread.mutate({ communityId: selected.id, title: threadTitle.trim(), body: threadBody.trim() })}>{createThread.isPending ? "Publishing…" : "Publish thread"}</Button></CardContent></Card>}
            </div>}
          </section>
        </div>
      </div>
    </main>
  );
}
