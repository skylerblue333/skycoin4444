import {
  AlertTriangle,
  Loader2,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Send,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

function CommentThread({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const utils = trpc.useUtils();
  const commentsQuery = trpc.comments.listByPost.useQuery({ postId });
  const comments = commentsQuery.data ?? [];
  const createComment = trpc.comments.create.useMutation({
    onSuccess: async () => {
      setContent("");
      await utils.comments.listByPost.invalidate({ postId });
    },
    onError: error => toast.error(error.message),
  });
  const deleteComment = trpc.comments.deleteOwn.useMutation({
    onSuccess: async () => {
      await utils.comments.listByPost.invalidate({ postId });
    },
    onError: error => toast.error(error.message),
  });

  return (
    <div className="mt-5 border-t border-slate-700 pt-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <MessageCircle className="h-3.5 w-3.5" /> Persisted comments
      </div>
      {commentsQuery.isLoading ? (
        <Loader2
          className="mt-3 h-4 w-4 animate-spin text-sky-300"
          aria-label="Loading comments"
        />
      ) : commentsQuery.isError ? (
        <p className="mt-3 text-xs text-amber-200">
          {commentsQuery.error.message}
        </p>
      ) : comments.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">No stored comments yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="flex items-start justify-between gap-3 rounded-lg bg-slate-950/70 p-3"
            >
              <div>
                <p className="text-sm text-slate-200">{comment.content}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString()
                    : ""}
                </p>
              </div>
              {user?.id === comment.userId ? (
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Delete comment"
                  onClick={() =>
                    deleteComment.mutate({ commentId: comment.id })
                  }
                  disabled={deleteComment.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
      {user ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={event => {
            event.preventDefault();
            const trimmed = content.trim();
            if (trimmed) createComment.mutate({ postId, content: trimmed });
          }}
        >
          <Textarea
            value={content}
            maxLength={255}
            onChange={event => setContent(event.target.value)}
            placeholder="Add a comment…"
            className="min-h-10 border-slate-700 bg-slate-950"
            disabled={createComment.isPending}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || createComment.isPending}
          >
            {createComment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Add comment</span>
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export default function Community() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [content, setContent] = useState("");
  const utils = trpc.useUtils();
  const postsQuery = trpc.community.listPosts.useQuery({
    limit: 20,
    offset: 0,
  });
  const createPost = trpc.community.createPost.useMutation({
    onSuccess: async () => {
      setContent("");
      await utils.community.listPosts.invalidate();
      toast.success("Post published.");
    },
    onError: error => toast.error(error.message),
  });
  const deletePost = trpc.community.deleteOwnPost.useMutation({
    onSuccess: async () => {
      await utils.community.listPosts.invalidate();
      toast.success("Post deleted.");
    },
    onError: error => toast.error(error.message),
  });

  const posts = postsQuery.data ?? [];

  const publish = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    createPost.mutate({ content: trimmed });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
            <MessageSquare className="h-3.5 w-3.5" /> Persisted posts enabled
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Community
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Community posts are stored in the platform database. Memberships,
            private groups, voice rooms, token-gated access, moderation queues,
            and engagement analytics are not configured for this deployment.
          </p>
        </header>

        {!authLoading && isAuthenticated ? (
          <Card className="mt-8 border-slate-700 bg-slate-900">
            <CardContent className="p-5">
              <label
                htmlFor="community-post"
                className="text-sm font-medium text-white"
              >
                Share a post
              </label>
              <Textarea
                id="community-post"
                value={content}
                maxLength={255}
                onChange={event => setContent(event.target.value)}
                placeholder="Write a community update…"
                className="mt-3 border-slate-700 bg-slate-950"
                disabled={createPost.isPending}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {content.length}/255
                </span>
                <Button
                  onClick={publish}
                  disabled={!content.trim() || createPost.isPending}
                >
                  {createPost.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Publish
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Recent posts</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void postsQuery.refetch()}
              disabled={postsQuery.isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${postsQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {postsQuery.isLoading ? (
            <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
              <Loader2
                className="h-6 w-6 animate-spin text-sky-300"
                aria-label="Loading posts"
              />
            </div>
          ) : postsQuery.isError ? (
            <Card className="border-amber-900/60 bg-amber-950/30">
              <CardContent className="flex items-start gap-3 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <h3 className="font-semibold text-amber-100">
                    Posts unavailable
                  </h3>
                  <p className="mt-1 text-sm text-amber-200">
                    {postsQuery.error.message}
                  </p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => void postsQuery.refetch()}
                  >
                    Try again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="border-slate-700 bg-slate-900">
              <CardContent className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
                <MessageSquare className="h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm text-slate-300">
                  No persisted posts yet.
                </p>
                {!isAuthenticated ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Sign in to publish the first post.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id} className="border-slate-700 bg-slate-900">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <UsersRound className="h-4 w-4 text-sky-300" />
                        <span>{post.userId ?? "Community member"}</span>
                        <span className="text-xs text-slate-500">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      {user?.id === post.userId ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Delete post"
                          onClick={() => deletePost.mutate({ postId: post.id })}
                          disabled={deletePost.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-100">
                      {post.content}
                    </p>
                    <CommentThread postId={post.id} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">Scope boundary</h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                Posts are persisted. Membership, private channels, messaging,
                token access, moderation operations, and engagement analytics
                remain unavailable.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
