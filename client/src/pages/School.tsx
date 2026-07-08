import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Search, Star, Clock, Users, Trophy, Brain, Code2,
  TrendingUp, Shield, Coins, Gamepad2, Globe, Play, Award,
  Target, GraduationCap, BarChart3, Lock, Sparkles, ArrowRight,
  Video, BookMarked, Layers, Flame
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Courses", icon: Layers },
  { id: "blockchain", label: "Blockchain", icon: Coins },
  { id: "defi", label: "DeFi & Trading", icon: TrendingUp },
  { id: "ai", label: "AI & ML", icon: Brain },
  { id: "web3", label: "Web3 Dev", icon: Code2 },
  { id: "security", label: "Security", icon: Shield },
  { id: "nft", label: "NFTs", icon: Sparkles },
  { id: "gaming", label: "GameFi", icon: Gamepad2 },
  { id: "creator", label: "Creator", icon: Globe },
  { id: "languages", label: "Languages", icon: Globe },
];

const COURSES = [
  { id: 1, slug: "blockchain-fundamentals", category: "blockchain", title: "Blockchain Fundamentals", subtitle: "Master distributed ledger technology", instructor: "Dr. Alex Chen", instructorAvatar: "AC", level: "Beginner", duration: "12h 30m", lessons: 48, students: 24891, rating: 4.9, reviews: 3241, price: 0, tags: ["Bitcoin", "Ethereum", "Consensus"], thumbnail: "🔗", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30", badge: "Most Popular", badgeColor: "bg-yellow-500/20 text-yellow-400", description: "Learn how blockchain works from the ground up. Covers consensus mechanisms, cryptographic hashing, smart contracts, and real-world applications." },
  { id: 2, slug: "defi-mastery", category: "defi", title: "DeFi Mastery", subtitle: "Yield farming, liquidity pools, protocol analysis", instructor: "Sarah Kim", instructorAvatar: "SK", level: "Intermediate", duration: "18h 45m", lessons: 72, students: 18234, rating: 4.8, reviews: 2187, price: 299, tags: ["Uniswap", "Aave", "Yield Farming"], thumbnail: "💎", color: "from-green-500/20 to-emerald-500/20", border: "border-purple-500/30", badge: "Top Rated", badgeColor: "bg-purple-600/20 text-purple-400", description: "Deep dive into decentralized finance. Navigate DEXs, optimize yield strategies, manage risk, and analyze protocol tokenomics." },
  { id: 3, slug: "ai-trading-systems", category: "ai", title: "AI Trading Systems", subtitle: "Build algorithmic trading bots with ML", instructor: "Marcus Webb", instructorAvatar: "MW", level: "Advanced", duration: "24h 15m", lessons: 96, students: 12456, rating: 4.9, reviews: 1876, price: 599, tags: ["Python", "TensorFlow", "Backtesting"], thumbnail: "🤖", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30", badge: "New", badgeColor: "bg-purple-500/20 text-purple-400", description: "Build production-grade AI trading systems. Covers sentiment analysis, price prediction models, backtesting frameworks, and live deployment." },
  { id: 4, slug: "solidity-smart-contracts", category: "web3", title: "Solidity Smart Contracts", subtitle: "Write, test, and deploy production contracts", instructor: "Elena Vasquez", instructorAvatar: "EV", level: "Intermediate", duration: "20h 00m", lessons: 80, students: 21034, rating: 4.7, reviews: 2934, price: 399, tags: ["Solidity", "Hardhat", "ERC-20"], thumbnail: "⚡", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", badge: "Bestseller", badgeColor: "bg-blue-500/20 text-blue-400", description: "Master Solidity from basics to advanced patterns. Build ERC-20 tokens, NFT contracts, DAOs, and DeFi protocols with security best practices." },
  { id: 5, slug: "english-fluency", category: "languages", title: "English Fluency Mastery", subtitle: "Master conversational and professional English", instructor: "James Wilson", instructorAvatar: "JW", level: "Beginner", duration: "16h 00m", lessons: 64, students: 89234, rating: 4.8, reviews: 5234, price: 0, tags: ["Speaking", "Grammar", "Business"], thumbnail: "🇬🇧", color: "from-red-500/20 to-pink-500/20", border: "border-red-500/30", badge: "Popular", badgeColor: "bg-red-500/20 text-red-400", description: "Achieve fluency in English. Covers pronunciation, grammar, business communication, and cultural nuances." },
  { id: 6, slug: "mandarin-chinese", category: "languages", title: "Mandarin Chinese Mastery", subtitle: "Learn Mandarin from basics to advanced", instructor: "Li Wei", instructorAvatar: "LW", level: "Beginner", duration: "20h 00m", lessons: 80, students: 67234, rating: 4.9, reviews: 4123, price: 0, tags: ["Mandarin", "HSK", "Culture"], thumbnail: "🇨🇳", color: "from-red-500/20 to-yellow-500/20", border: "border-red-500/30", badge: "Trending", badgeColor: "bg-red-500/20 text-red-400", description: "Master Mandarin Chinese. Covers characters, tones, conversational skills, and cultural context." },
  { id: 7, slug: "spanish-essentials", category: "languages", title: "Spanish Essentials", subtitle: "Spanish for travelers and professionals", instructor: "Carlos Rodriguez", instructorAvatar: "CR", level: "Beginner", duration: "14h 30m", lessons: 58, students: 54123, rating: 4.7, reviews: 3456, price: 0, tags: ["Spanish", "Travel", "Business"], thumbnail: "🇪🇸", color: "from-yellow-500/20 to-red-500/20", border: "border-yellow-500/30", badge: "New", badgeColor: "bg-yellow-500/20 text-yellow-400", description: "Learn practical Spanish. Perfect for travel, business, and everyday communication." },
  { id: 8, slug: "nft-creation", category: "nft", title: "NFT Creation & Trading", subtitle: "Create, mint, and trade NFTs", instructor: "Alex Turner", instructorAvatar: "AT", level: "Intermediate", duration: "15h 00m", lessons: 60, students: 32145, rating: 4.6, reviews: 1987, price: 199, tags: ["NFT", "Minting", "OpenSea"], thumbnail: "🎨", color: "from-pink-500/20 to-purple-500/20", border: "border-pink-500/30", badge: "Hot", badgeColor: "bg-pink-500/20 text-pink-400", description: "Learn to create, mint, and trade NFTs. Covers art preparation, smart contracts, and marketplace strategies." },
];

export default function School() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [activeTab, setActiveTab] = useState<"courses" | "tracks" | "my-learning">("courses");

  const filtered = COURSES.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === "all" || c.category === selectedCategory;
    const matchLevel = selectedLevel === "all" || c.level.toLowerCase() === selectedLevel;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <div className="container py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
              <GraduationCap className="h-3.5 w-3.5" /> SKY SCHOOL — LEARN. EARN. BUILD.
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master <span className="text-primary">Web3</span> &amp; <span className="text-purple-400">AI</span><br />Earn While You Learn
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">World-class courses on blockchain, DeFi, AI trading, and Web3 development. Complete courses to earn SKY444 rewards and verifiable on-chain certificates.</p>
            <div className="flex flex-wrap gap-6 text-sm">
              {[{ icon: BookOpen, label: "18 Courses", color: "text-primary" }, { icon: Users, label: "543K+ Students", color: "text-blue-400" }, { icon: Trophy, label: "On-Chain Certs", color: "text-yellow-400" }, { icon: Coins, label: "Earn SKY444", color: "text-purple-400" }].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2"><Icon className={`h-4 w-4 ${color}`} /><span className="font-medium">{label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: "Total Students", value: "543K+", icon: Users, color: "text-blue-400" }, { label: "Courses Available", value: "18", icon: BookOpen, color: "text-primary" }, { label: "SKY444 Earned", value: "12.8M", icon: Coins, color: "text-yellow-400" }, { label: "Certificates Issued", value: "89K", icon: Award, color: "text-purple-400" }].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
              <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-bold font-mono">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border/50">
          {[{ id: "courses", label: "All Courses", icon: BookOpen }, { id: "tracks", label: "Learning Tracks", icon: Target }, { id: "my-learning", icon: BarChart3 }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${activeTab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {activeTab === "courses" && (
          <>
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search courses, topics..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card/50 border-border/50" />
              </div>
              <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="px-3 py-2 rounded-lg border border-border/50 bg-card/50 text-sm text-foreground">
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedCategory === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-card/30 text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="h-3 w-3" />{cat.label}
                  </button>
                );
              })}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(course => (
                <Link key={course.id} href={`/school/course/${course.slug}`}>
                  <div className={`rounded-xl border ${course.border} bg-gradient-to-br ${course.color} hover:scale-[1.02] transition-all duration-200 cursor-pointer group overflow-hidden`}>
                    <div className="relative h-32 flex items-center justify-center bg-card/30 border-b border-border/30">
                      <span className="text-5xl">{course.thumbnail}</span>
                      <div className="absolute top-3 left-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${course.badgeColor}`}>{course.badge}</span></div>
                      <div className="absolute top-3 right-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${course.level === "Beginner" ? "border-purple-500/40 text-purple-400 bg-purple-600/10" : course.level === "Intermediate" ? "border-blue-500/40 text-blue-400 bg-blue-500/10" : course.level === "Advanced" ? "border-orange-500/40 text-orange-400 bg-orange-500/10" : "border-red-500/40 text-red-400 bg-red-500/10"}`}>{course.level}</span></div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" /> {course.students.toLocaleString()} Students
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-400" /> {course.rating} ({course.reviews.toLocaleString()})
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{course.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookMarked className="h-3 w-3" /> {course.lessons} Lessons
                        </div>
                        {course.price === 0 ? (
                          <span className="font-bold text-green-500">FREE</span>
                        ) : (
                          <span className="font-bold">${course.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {activeTab === "tracks" && (
          <div className="py-12 text-center text-muted-foreground">
            <Trophy className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Learning Tracks Coming Soon!</h3>
            <p className="max-w-md mx-auto">Curated learning paths to guide you from beginner to expert in specific domains. Stay tuned for exciting updates!</p>
          </div>
        )}

        {activeTab === "my-learning" && (
          <div className="py-12 text-center text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your Learning Journey Starts Here!</h3>
            <p className="max-w-md mx-auto">Enroll in courses to track your progress, earn certificates, and build your skills. What will you learn today?</p>
            {!isAuthenticated && (
              <Button asChild className="mt-6">
                <Link href="/login">Sign In to View My Learning</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
