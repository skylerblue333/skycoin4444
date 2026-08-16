import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  MessageCircle, ThumbsUp, Share2, Flag, Reply, Search, Filter, TrendingUp,
  Clock, User, Award, Bookmark, Heart, Send, X, Edit2, Trash2, Pin,
  AlertCircle, CheckCircle, HelpCircle, Lightbulb, Bug, Zap, Eye
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "instructor" | "student" | "moderator";
  };
  title: string;
  content: string;
  category: "general" | "question" | "bug" | "suggestion" | "resource";
  course: string;
  lesson: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isResolved: boolean;
  tags: string[];
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: "instructor" | "student" | "moderator";
  };
  content: string;
  createdAt: Date;
  likes: number;
  isAnswer: boolean;
}

// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: {
      name: "Alice Johnson",
      avatar: "👩‍💻",
      role: "student"
    },
    title: "How do I deploy a smart contract to mainnet?",
    content: "I've written my smart contract and tested it on testnet. What are the steps to deploy it to Ethereum mainnet? Any best practices I should follow?",
    category: "question",
    course: "blockchain-101",
    lesson: "Smart Contracts Intro",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    replies: 5,
    views: 89,
    isPinned: false,
    isResolved: true,
    tags: ["smart-contracts", "deployment", "mainnet"]
  },
  {
    id: "p2",
    author: {
      name: "Bob Smith",
      avatar: "👨‍🏫",
      role: "instructor"
    },
    title: "New lesson: Advanced Solidity Patterns",
    content: "I've just released a new lesson covering advanced Solidity patterns including proxy patterns, access control, and gas optimization. Check it out in the course materials!",
    category: "resource",
    course: "blockchain-101",
    lesson: "Smart Contracts Intro",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: 45,
    replies: 8,
    views: 234,
    isPinned: true,
    isResolved: false,
    tags: ["solidity", "patterns", "advanced"]
  },
  {
    id: "p3",
    author: {
      name: "Carol Davis",
      avatar: "👩‍💼",
      role: "student"
    },
    title: "Bug: Quiz not submitting answers",
    content: "When I try to submit my quiz answers, I get an error message. The page shows 'Error submitting quiz' but doesn't tell me what went wrong. This happened in the Blockchain Fundamentals quiz.",
    category: "bug",
    course: "blockchain-101",
    lesson: "Final Assessment",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 3,
    replies: 2,
    views: 24,
    isPinned: false,
    isResolved: false,
    tags: ["bug", "quiz", "technical-issue"]
  },
  {
    id: "p4",
    author: {
      name: "David Lee",
      avatar: "👨‍💻",
      role: "student"
    },
    title: "Suggestion: Add interactive coding challenges",
    content: "It would be great if the courses included interactive coding challenges where we can write and test code directly in the browser. This would help reinforce the concepts we're learning.",
    category: "suggestion",
    course: "python-dev",
    lesson: "Functions & Modules",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 28,
    replies: 6,
    views: 156,
    isPinned: false,
    isResolved: false,
    tags: ["feature-request", "interactive", "coding"]
  }
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  general: <MessageCircle className="w-4 h-4" />,
  question: <HelpCircle className="w-4 h-4" />,
  bug: <Bug className="w-4 h-4" />,
  suggestion: <Lightbulb className="w-4 h-4" />,
  resource: <Award className="w-4 h-4" />
};

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  question: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  bug: "bg-red-500/20 text-red-300 border-red-500/30",
  suggestion: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  resource: "bg-green-500/20 text-green-300 border-green-500/30"
};

export default function DiscussionForums() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "question" as const,
    course: "blockchain-101",
    lesson: "General"
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error("Please fill in all fields");
      return;
    }

    const post: Post = {
      id: `p${posts.length + 1}`,
      author: {
        name: user?.name || "Anonymous",
        avatar: "👤",
        role: "student"
      },
      ...newPost,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      replies: 0,
      views: 0,
      isPinned: false,
      isResolved: false,
      tags: newPost.title.toLowerCase().split(" ").slice(0, 3)
    };

    setPosts([post, ...posts]);
    setNewPost({
      title: "",
      content: "",
      category: "question",
      course: "blockchain-101",
      lesson: "General"
    });
    setShowNewPostForm(false);
    toast.success("Post created successfully!");
  };

  const handleLikePost = (id: string) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    if (selectedPost) {
      setPosts(posts.map(p =>
        p.id === selectedPost.id ? { ...p, replies: p.replies + 1 } : p
      ));
      setReplyContent("");
      toast.success("Reply posted!");
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Post Detail View
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setSelectedPost(null)}
            className="text-slate-400 hover:text-white mb-6"
          >
            ← Back to Forums
          </Button>

          {/* Post */}
          <Card className="bg-slate-900/50 border border-white/10 mb-6">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-white">{selectedPost.title}</h1>
                    {selectedPost.isPinned && (
                      <Pin className="w-5 h-5 text-yellow-400" />
                    )}
                    {selectedPost.isResolved && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedPost.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedPost.createdAt.toLocaleDateString()}
                    </span>
                    <span>{selectedPost.views} views</span>
                  </div>
                </div>
                <Badge className={`text-xs px-3 py-1 ${CATEGORY_COLORS[selectedPost.category]}`}>
                  {CATEGORY_ICONS[selectedPost.category]}
                  <span className="ml-1">{selectedPost.category.toUpperCase()}</span>
                </Badge>
              </div>

              {/* Content */}
              <p className="text-slate-300 text-lg leading-relaxed mb-6">{selectedPost.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-700">
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-cyan-400"
                  onClick={() => handleLikePost(selectedPost.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {selectedPost.likes} Likes
                </Button>
                <Button variant="ghost" className="text-slate-400 hover:text-cyan-400">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {selectedPost.replies} Replies
                </Button>
                <Button variant="ghost" className="text-slate-400 hover:text-cyan-400">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reply Form */}
          <Card className="bg-slate-900/50 border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Your Reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, answer, or suggestion..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white min-h-32"
              />
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300"
                  onClick={handleReply}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Reply
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-600"
                  onClick={() => setReplyContent("")}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">{selectedPost.replies} Replies</h2>
            {[1, 2].map(i => (
              <Card key={i} className="bg-slate-900/50 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">👤</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-white">Reply Author {i}</p>
                        {i === 1 && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs px-2 py-0.5">
                            ANSWER
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 mb-3">This is a helpful reply to the question. The author has provided a solution or insight.</p>
                      <div className="flex gap-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {i === 1 ? "12" : "5"}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Forums List View
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discussion Forums</h1>
          <p className="text-slate-400">Connect with fellow learners, ask questions, and share knowledge</p>
        </div>

        {/* New Post Button */}
        <div className="mb-8">
          <Button
            className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30"
            onClick={() => setShowNewPostForm(!showNewPostForm)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <Card className="bg-slate-900/50 border border-cyan-500/30 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Start a New Discussion</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPostForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 block mb-2">Title</label>
                <Input
                  placeholder="What's your question or topic?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 block mb-2">Description</label>
                <Textarea
                  placeholder="Provide details and context..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white min-h-32"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded p-2"
                  >
                    <option value="question">Question</option>
                    <option value="bug">Bug Report</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="resource">Resource</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Course</label>
                  <select
                    value={newPost.course}
                    onChange={(e) => setNewPost({ ...newPost, course: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded p-2"
                  >
                    <option value="blockchain-101">Blockchain Fundamentals</option>
                    <option value="python-dev">Python for Builders</option>
                    <option value="js-mastery">JavaScript & React</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300"
                  onClick={handleCreatePost}
                >
                  Post Discussion
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600"
                  onClick={() => setShowNewPostForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            {["all", "question", "bug", "suggestion", "resource"].map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-cyan-500/20 text-cyan-300" : "border-slate-600"}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card
              key={post.id}
              className="bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{post.author.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white hover:text-cyan-300 transition-colors">
                            {post.title}
                          </h3>
                          {post.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                          {post.isResolved && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{post.content.substring(0, 150)}...</p>
                      </div>
                      <Badge className={`text-xs px-2 py-1 shrink-0 ${CATEGORY_COLORS[post.category]}`}>
                        {post.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.replies}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
