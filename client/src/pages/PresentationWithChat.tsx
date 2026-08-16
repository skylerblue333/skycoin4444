import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Send, Users } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  duration: string;
  visual: string;
  script: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'TITLE SLIDE',
    duration: '30 seconds',
    visual: 'Bold "SKYCOIN4444" logo with gradient background, crypto ticker showing live prices',
    script: 'Good morning everyone. I\'m excited to present Skycoin4444 — the most comprehensive decentralized ecosystem ever built. This is one platform. One ecosystem. Unlimited potential.',
  },
  {
    id: 2,
    title: 'THE PROBLEM',
    duration: '1 minute',
    visual: 'Fragmented ecosystem diagram showing separate platforms',
    script: 'Today\'s crypto ecosystem is fragmented. You need one app for mining, another for social networking, a third for gaming, a fourth for trading, and a fifth for governance. Skycoin4444 solves this.',
  },
  {
    id: 3,
    title: 'THE SOLUTION',
    duration: '1 minute',
    visual: 'Integrated ecosystem diagram showing all components connected',
    script: 'Introducing Skycoin4444 — One Platform. One Ecosystem. Unlimited Potential. We\'ve integrated five major systems into one cohesive platform.',
  },
  {
    id: 4,
    title: 'MINING SYSTEM',
    duration: '1.5 minutes',
    visual: 'Mining dashboard showing real-time earnings, pools, workers',
    script: 'Our mining system features advanced pool management, AI-powered optimization, real-time monitoring, and automatic reward routing. With Skycoin4444 mining, users can earn passive income while sleeping.',
  },
  {
    id: 5,
    title: 'SOCIAL PLATFORM',
    duration: '1.5 minutes',
    visual: 'Social feed showing posts, stories, live streams, communities',
    script: 'Skycoin4444 Social features content creation, built-in monetization, real-time engagement, and privacy & safety. Unlike traditional social platforms, Skycoin4444 puts money directly in creators\' hands.',
  },
  {
    id: 6,
    title: 'GAMING SYSTEM',
    duration: '1.5 minutes',
    visual: 'Gaming dashboard showing tournaments, leaderboards, achievements',
    script: 'Skycoin4444 Gaming features competitive gaming, tournaments & competitions, gamification & progression, and play-to-earn mechanics. Gaming in Skycoin4444 isn\'t just fun — it\'s profitable.',
  },
  {
    id: 7,
    title: 'MARKETPLACE',
    duration: '1.5 minutes',
    visual: 'Marketplace showing products, checkout, seller dashboard',
    script: 'The Marketplace transforms Skycoin4444 into a complete commerce platform with buyer protection, seller tools, decentralized escrow, and instant crypto payments. Skycoin4444 Marketplace combines the best of Amazon, eBay, and crypto exchanges.',
  },
  {
    id: 8,
    title: 'GOVERNANCE & DAO',
    duration: '1.5 minutes',
    visual: 'DAO dashboard showing proposals, voting, treasury',
    script: 'Governance features democratic decision making, treasury management, proposal types, governance incentives, and community involvement. Skycoin4444 isn\'t controlled by us — it\'s controlled by the community.',
  },
  {
    id: 9,
    title: 'INTEGRATION & SYNERGY',
    duration: '1 minute',
    visual: 'Diagram showing how all systems connect and reinforce each other',
    script: 'Everything is connected. Mining → Social → Gaming → Marketplace → Governance → Mining. Every action in one system benefits all other systems. This creates a network effect where the entire ecosystem becomes more valuable as it grows.',
  },
  {
    id: 10,
    title: 'TECHNOLOGY STACK',
    duration: '1 minute',
    visual: 'Tech stack diagram showing architecture',
    script: 'Skycoin4444 is built on enterprise-grade technology: React 19, Node.js, tRPC, TiDB, Redis, Elasticsearch, Ethereum, Solana, Bitcoin, LLM-powered AI, Docker, and Kubernetes. This is production-ready, enterprise-grade technology.',
  },
  {
    id: 11,
    title: 'SECURITY & COMPLIANCE',
    duration: '1 minute',
    visual: 'Security features diagram',
    script: 'Security is paramount: AES-256 encryption, multi-factor authentication, audited smart contracts, KYC/AML compliance, GDPR compliant, SOC 2 Type II certified, and AI-powered fraud prevention. Users can trust Skycoin4444 with their assets and data.',
  },
  {
    id: 12,
    title: 'BUSINESS MODEL',
    duration: '1 minute',
    visual: 'Revenue streams diagram',
    script: 'Skycoin4444 generates revenue through transaction fees, premium features, advertising, token economics, partnerships, and revenue sharing. 70% goes to community, 20% to development, 10% to operations. We succeed when the community succeeds.',
  },
  {
    id: 13,
    title: 'MARKET OPPORTUNITY',
    duration: '1 minute',
    visual: 'Market size and growth projections',
    script: 'The opportunity is massive: Crypto Mining ($20B), Social Media ($200B), Gaming ($200B), E-commerce ($5T), Governance/DAO ($50B+). Skycoin4444 Total Addressable Market: $5+ trillion. Early adopters will capture enormous value.',
  },
  {
    id: 14,
    title: 'COMPETITIVE ADVANTAGES',
    duration: '1 minute',
    visual: 'Comparison chart vs competitors',
    script: 'What makes Skycoin4444 different: Integration, Decentralization, Transparency, Incentives, Scalability, Security, User Experience, Speed, Cost, and Innovation. Competitors focus on one market. Skycoin4444 dominates five.',
  },
  {
    id: 15,
    title: 'ROADMAP',
    duration: '1 minute',
    visual: 'Timeline showing phases and milestones',
    script: 'Q3 2026: Complete ecosystem launch. Q4 2026: Mobile apps, 1M users. Q1 2027: NFT integration, 5M users. Q2 2027: IPO preparation, 10M users. 2027+: Become the largest Web3 platform, 100M users, $1B revenue.',
  },
  {
    id: 16,
    title: 'TEAM & ADVISORS',
    duration: '1 minute',
    visual: 'Team photos and bios',
    script: 'Skycoin4444 is built by a world-class team with 10+ years in crypto and fintech, former engineers from Google/Amazon/Stripe, cryptography specialists, and crypto pioneers as advisors. We have the expertise to execute this vision.',
  },
  {
    id: 17,
    title: 'INVESTMENT OPPORTUNITY',
    duration: '1.5 minutes',
    visual: 'Investment terms and projections',
    script: 'We\'re raising $50M for Series A. Year 1: 10M users, $100M revenue. Year 2: 50M users, $500M revenue. Year 3: 100M users, $1B revenue. Conservative ROI: 10x by Year 3. This is the opportunity of a generation.',
  },
  {
    id: 18,
    title: 'CALL TO ACTION',
    duration: '1 minute',
    visual: 'Bold CTA with contact information',
    script: 'Skycoin4444 is live today. Experience it now at skycoinpro-ebv4wfmm.manus.space. Invest in the future. Join our community. The future is decentralized. The future is Skycoin4444. The future is now.',
  },
  {
    id: 19,
    title: 'Q&A',
    duration: 'Open-ended',
    visual: 'Contact information and social media',
    script: 'Thank you for your time. I\'m excited to answer any questions you have about Skycoin4444. Whether you\'re interested in becoming a user, investing, partnering, or joining the team, I\'m here to help.',
  },
];

export default function PresentationWithChat() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Moderator',
      message: 'Welcome to the Skycoin4444 presentation! Feel free to ask questions in the chat.',
      timestamp: new Date(),
      avatar: '🎤',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [viewerCount, setViewerCount] = useState(42);
  const scrollRef = useRef<HTMLDivElement>(null);

  const slide = SLIDES[currentSlide];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: inputValue,
        timestamp: new Date(),
        avatar: '👤',
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Simulate moderator response
      setTimeout(() => {
        const responses = [
          'Great question! Let me address that.',
          'Excellent point. That\'s exactly what we\'re focusing on.',
          'Thanks for asking. We\'ll cover that in more detail later.',
          'That\'s a common concern. Here\'s how we\'re addressing it.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          user: 'Presenter',
          message: randomResponse,
          timestamp: new Date(),
          avatar: '🎤',
        }]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Presentation Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-orange-500 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">SKYCOIN4444 Presentation</h1>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-semibold">{viewerCount} Viewers</span>
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            {/* Slide Visual */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-12 mb-6 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  {slide.title}
                </h2>
                <p className="text-gray-400 text-lg mb-8">{slide.visual}</p>
                <div className="bg-slate-700 rounded p-4 text-sm text-gray-300">
                  <p className="italic">{slide.script}</p>
                </div>
              </div>
            </div>

            {/* Slide Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-400">
                <span className="font-semibold">Slide {currentSlide + 1}</span> of {SLIDES.length} • {slide.duration}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrevSlide}
                  disabled={currentSlide === 0}
                  variant="outline"
                  size="sm"
                  className="bg-slate-800 border-slate-600 hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNextSlide}
                  disabled={currentSlide === SLIDES.length - 1}
                  variant="outline"
                  size="sm"
                  className="bg-slate-800 border-slate-600 hover:bg-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Slide Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-4">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`flex-shrink-0 px-3 py-2 rounded text-xs font-semibold transition-all ${
                    idx === currentSlide
                      ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white'
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700">
          <h3 className="font-bold text-lg">Live Chat</h3>
          <p className="text-xs text-gray-400">{messages.length} messages</p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{msg.avatar}</span>
                  <span className="font-semibold text-pink-400">{msg.user}</span>
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-300 ml-7">{msg.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              className="bg-slate-800 border-slate-600 text-white placeholder-gray-500"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
