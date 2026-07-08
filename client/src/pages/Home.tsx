import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, TrendingUp, Gamepad2, ShoppingCart, Radio, Brain, Award, Gem, Rocket, Lock, BarChart3, Zap as ZapIcon, Code2, Cpu, Layers } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                SKY4444
              </span>
            </h1>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
              The Strategic Digital Ecosystem Where Every Action Matters
            </p>
            <p className="text-lg text-gray-400">
              Mine. Trade. Create. Earn. All in one platform.
            </p>
            
            <div className="flex gap-4 justify-center pt-8 flex-wrap">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
              <Card className="bg-black/50 border-purple-500/30 p-4">
                <div className="text-3xl font-bold text-pink-500">1,055</div>
                <div className="text-sm text-gray-400">Working Screens</div>
              </Card>
              <Card className="bg-black/50 border-purple-500/30 p-4">
                <div className="text-3xl font-bold text-cyan-500">320</div>
                <div className="text-sm text-gray-400">API Endpoints</div>
              </Card>
              <Card className="bg-black/50 border-purple-500/30 p-4">
                <div className="text-3xl font-bold text-purple-500">1M+</div>
                <div className="text-sm text-gray-400">Lines of Code</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 1,055 Screens Overview Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-purple-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">1,055 Fully-Wired Working Screens</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Robust screens across 13 major categories, all connected to real APIs, databases, and blockchain infrastructure
            </p>
          </div>

          {/* Screen Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* AI & Automation */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 p-6 hover:border-blue-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🤖 AI & Automation</h3>
                  <p className="text-gray-300 font-semibold text-lg">42 Screens</p>
                </div>
                <Brain className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">AI Code Studio, Agent Market, AI Trading, Governance, Persona System, and more</p>
              <div className="text-xs text-gray-500">✓ Real AI integration ✓ Live automation ✓ Agent coordination</div>
            </Card>

            {/* Trading & Finance */}
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 p-6 hover:border-green-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">💰 Trading & Finance</h3>
                  <p className="text-gray-300 font-semibold text-lg">13 Screens</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Portfolio tracking, Cross-chain swaps, Staking, Day trading, Yield farming</p>
              <div className="text-xs text-gray-500">✓ Real-time pricing ✓ Live trading ✓ Smart contracts</div>
            </Card>

            {/* Marketplace & Commerce */}
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30 p-6 hover:border-orange-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🛍️ Marketplace</h3>
                  <p className="text-gray-300 font-semibold text-lg">37 Screens</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Product listings, Orders, Escrow, Bulk ordering, Vendor management</p>
              <div className="text-xs text-gray-500">✓ Live inventory ✓ Payment processing ✓ Fulfillment</div>
            </Card>

            {/* Social & Community */}
            <Card className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border-pink-500/30 p-6 hover:border-pink-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">👥 Social</h3>
                  <p className="text-gray-300 font-semibold text-lg">31 Screens</p>
                </div>
                <Users className="w-8 h-8 text-pink-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Posts, Comments, Communities, Follows, Direct messaging, Groups</p>
              <div className="text-xs text-gray-500">✓ Real-time feeds ✓ Notifications ✓ User interactions</div>
            </Card>

            {/* Gaming & Entertainment */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30 p-6 hover:border-purple-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🎮 Gaming</h3>
                  <p className="text-gray-300 font-semibold text-lg">20 Screens</p>
                </div>
                <Gamepad2 className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Game lobbies, Tournaments, Quests, Leaderboards, Crypto games</p>
              <div className="text-xs text-gray-500">✓ Real rewards ✓ Live tournaments ✓ Blockchain scoring</div>
            </Card>

            {/* Education & Learning */}
            <Card className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-500/30 p-6 hover:border-yellow-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🎓 Education</h3>
                  <p className="text-gray-300 font-semibold text-lg">14 Screens</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Courses, Lessons, Quizzes, Certificates, Learning paths</p>
              <div className="text-xs text-gray-500">✓ On-chain certificates ✓ Progress tracking ✓ Live instructors</div>
            </Card>

            {/* Admin & Management */}
            <Card className="bg-gradient-to-br from-red-900/20 to-crimson-900/20 border-red-500/30 p-6 hover:border-red-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">⚙️ Admin</h3>
                  <p className="text-gray-300 font-semibold text-lg">99 Screens</p>
                </div>
                <Cpu className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Dashboards, User management, Moderation, Settings, Audit logs</p>
              <div className="text-xs text-gray-500">✓ Real-time monitoring ✓ Role-based access ✓ Analytics</div>
            </Card>

            {/* API & Integration */}
            <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 p-6 hover:border-cyan-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🔌 API & Integration</h3>
                  <p className="text-gray-300 font-semibold text-lg">27 Screens</p>
                </div>
                <Code2 className="w-8 h-8 text-cyan-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">API docs, Keys management, Webhooks, Integration testing</p>
              <div className="text-xs text-gray-500">✓ Live API endpoints ✓ Documentation ✓ Rate limiting</div>
            </Card>

            {/* Analytics & Data */}
            <Card className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-500/30 p-6 hover:border-violet-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📊 Analytics</h3>
                  <p className="text-gray-300 font-semibold text-lg">36 Screens</p>
                </div>
                <BarChart3 className="w-8 h-8 text-violet-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Dashboards, Reports, Charts, Metrics, Data visualization</p>
              <div className="text-xs text-gray-500">✓ Real-time data ✓ Custom reports ✓ Exports</div>
            </Card>

            {/* User & Profile */}
            <Card className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border-teal-500/30 p-6 hover:border-teal-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">👤 User & Profile</h3>
                  <p className="text-gray-300 font-semibold text-lg">46 Screens</p>
                </div>
                <Users className="w-8 h-8 text-teal-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Profiles, Creator economy, Monetization, Followers, Verification</p>
              <div className="text-xs text-gray-500">✓ Live profiles ✓ Earnings tracking ✓ KYC</div>
            </Card>

            {/* Wallet & Crypto */}
            <Card className="bg-gradient-to-br from-lime-900/20 to-green-900/20 border-lime-500/30 p-6 hover:border-lime-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">💳 Wallet</h3>
                  <p className="text-gray-300 font-semibold text-lg">6 Screens</p>
                </div>
                <Lock className="w-8 h-8 text-lime-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Unified wallet, NFT wallet, Balance tracking, Transactions</p>
              <div className="text-xs text-gray-500">✓ Multi-chain ✓ Hardware wallet ✓ Security</div>
            </Card>

            {/* Content & Media */}
            <Card className="bg-gradient-to-br from-fuchsia-900/20 to-pink-900/20 border-fuchsia-500/30 p-6 hover:border-fuchsia-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🎬 Content</h3>
                  <p className="text-gray-300 font-semibold text-lg">21 Screens</p>
                </div>
                <Radio className="w-8 h-8 text-fuchsia-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Live streaming, Podcasts, Blogs, Media galleries, Video editing</p>
              <div className="text-xs text-gray-500">✓ Live streaming ✓ Monetization ✓ Analytics</div>
            </Card>

            {/* Other Features */}
            <Card className="bg-gradient-to-br from-slate-900/20 to-gray-900/20 border-slate-500/30 p-6 hover:border-slate-500/60 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">⭐ More Features</h3>
                  <p className="text-gray-300 font-semibold text-lg">663 Screens</p>
                </div>
                <Layers className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Advanced features, Testing tools, Utilities, Components, And much more</p>
              <div className="text-xs text-gray-500">✓ Fully functional ✓ Well documented ✓ Production ready</div>
            </Card>
          </div>

          {/* Key Stats */}
          <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-lg p-12 text-center mb-12">
            <h3 className="text-3xl font-bold mb-8">Platform Capabilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-4xl font-bold text-pink-500">1,055</p>
                <p className="text-gray-400 mt-2">Working Screens</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-500">13</p>
                <p className="text-gray-400 mt-2">Major Categories</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-cyan-500">320</p>
                <p className="text-gray-400 mt-2">API Endpoints</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-500">∞</p>
                <p className="text-gray-400 mt-2">Possibilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900/10 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Quick Access to Major Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Finance */}
            <Link href="/walletoverview">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <Zap className="w-8 h-8 text-pink-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">💰 Finance</h3>
                <p className="text-gray-400 text-sm">Mining, trading, staking, and portfolio management</p>
              </Card>
            </Link>

            {/* Social */}
            <Link href="/social">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <Users className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">👥 Social</h3>
                <p className="text-gray-400 text-sm">Connect, share, and build communities</p>
              </Card>
            </Link>

            {/* Gaming */}
            <Link href="/gamelobby">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <Gamepad2 className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">🎮 Gaming</h3>
                <p className="text-gray-400 text-sm">Play, compete, and earn rewards</p>
              </Card>
            </Link>

            {/* Marketplace */}
            <Link href="/marketplace">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <ShoppingCart className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">🛍️ Marketplace</h3>
                <p className="text-gray-400 text-sm">Buy, sell, and discover products</p>
              </Card>
            </Link>

            {/* Content */}
            <Link href="/streaming">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <Radio className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">🎬 Content</h3>
                <p className="text-gray-400 text-sm">Stream, create, and monetize</p>
              </Card>
            </Link>

            {/* Education */}
            <Link href="/school">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <Brain className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">🎓 Education</h3>
                <p className="text-gray-400 text-sm">Learn blockchain, crypto, and AI</p>
              </Card>
            </Link>

            {/* AI */}
            <Link href="/aiassistant">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <Brain className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">🤖 Hope AI</h3>
                <p className="text-gray-400 text-sm">Advanced AI assistance and automation</p>
              </Card>
            </Link>

            {/* Trading */}
            <Link href="/aitrading">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all p-6 h-full">
                <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">📈 Trading</h3>
                <p className="text-gray-400 text-sm">Real-time trading and swaps</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Explore All 1,055 Screens?</h2>
          <p className="text-xl text-gray-400">
            Start earning, trading, creating, and building today. Access all features instantly.
          </p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-12 py-6 text-lg">
              Sign Up Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">SKY4444 Scalable</h4>
            <p className="text-gray-400 text-sm">The leading strategic digital ecosystem for Web3, AI, and decentralized finance. 1,055 fully-wired screens powering the future of digital commerce and community.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-purple-400"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-400"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-400"><FontAwesomeIcon icon={faLinkedinIn} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-400"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-4">Platform</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Features</a></li>
              <li><a href="#" className="hover:text-purple-400">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-400">Security</a></li>
              <li><a href="#" className="hover:text-purple-400">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Documentation</a></li>
              <li><a href="#" className="hover:text-purple-400">API Docs</a></li>
              <li><a href="#" className="hover:text-purple-400">Blog</a></li>
              <li><a href="#" className="hover:text-purple-400">Support</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Legal</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Privacy</a></li>
              <li><a href="#" className="hover:text-purple-400">Terms</a></li>
              <li><a href="#" className="hover:text-purple-400">Compliance</a></li>
              <li><a href="#" className="hover:text-purple-400">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-purple-500/20 text-center text-gray-500 text-sm">
          <p>&copy; 2026 SKY4444 Scalable. All rights reserved. | 1,055 Screens. Infinite Possibilities.</p>
        </div>
      </footer>
    </div>
  );
}
