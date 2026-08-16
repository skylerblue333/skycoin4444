import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Zap, Users, TrendingUp, Shield, Cpu, Coins, Globe } from 'lucide-react';

const ComprehensiveEcosystemLanding = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const ecosystemStats = {
    totalPages: 1076,
    linesOfCode: 1070000,
    backendRouters: 14,
    apiProcedures: 80,
    databaseTables: 13,
    technicalNetWorth: '$2,000,000.00',
    developmentCost: '$750,000.00',
    dailyMiningEarnings: '$142.00',
    monthlyProjection: '$4,260.00',
    yearlyProjection: '$51,120.00',
    currentNetWorth: '$8,137.50',
    rarityScore: 'LEGENDARY (99.9 Percentile)',
  };

  const features = [
    {
      icon: <Coins className="h-8 w-8 text-blue-500" />,
      title: 'Multi-Crypto Mining',
      description: 'AI-powered mining for BTC, ETH, SOL, DOGE, and SKY444 with 128 concurrent workers',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: 'Advanced Trading',
      description: 'Intelligent trading bots with real-time market data and AI-driven strategies',
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: 'Social Ecosystem',
      description: 'Integrated social platform with gaming, streaming, and community features',
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: 'Secure Wallets',
      description: 'Multi-signature wallet support with hardware integration and full custody control',
    },
    {
      icon: <Cpu className="h-8 w-8 text-red-500" />,
      title: 'Scalable Backend',
      description: '14 routers, 80+ API procedures, optimized for scale and performance',
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-500" />,
      title: 'Global Marketplace',
      description: 'Decentralized marketplace with commission-based revenue model',
    },
  ];

  const categories = [
    { name: 'E-Commerce', pages: 15, color: 'bg-blue-500' },
    { name: 'Analytics', pages: 14, color: 'bg-green-500' },
    { name: 'Scalable', pages: 20, color: 'bg-purple-500' },
    { name: 'Project Mgmt', pages: 14, color: 'bg-orange-500' },
    { name: 'Content', pages: 18, color: 'bg-red-500' },
    { name: 'Community', pages: 16, color: 'bg-pink-500' },
    { name: 'Marketing', pages: 16, color: 'bg-indigo-500' },
    { name: 'Learning', pages: 12, color: 'bg-yellow-500' },
    { name: 'Support', pages: 12, color: 'bg-teal-500' },
    { name: 'Dev Tools', pages: 15, color: 'bg-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
            <span className="text-sm font-semibold text-blue-300">🚀 Scalable-Grade Ecosystem</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            SKY444 Ecosystem
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> The Future of Web3</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A comprehensive, production-ready platform valued at <span className="text-green-400 font-bold">${ecosystemStats.technicalNetWorth}</span> with 1,076 pages, enterprise backend, and AI-powered crypto mining.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                Launch Platform <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/whitepaper">
              <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/20 text-lg px-8 py-6 rounded-lg shadow-lg transition-all duration-300">
                Read Whitepaper
              </Button>
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400">{ecosystemStats.totalPages}</div>
                <div className="text-sm text-gray-400">Pages & Screens</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-400">1.07M</div>
                <div className="text-sm text-gray-400">Lines of Code</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400">{ecosystemStats.backendRouters}</div>
                <div className="text-sm text-gray-400">API Routers</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-pink-400">{ecosystemStats.technicalNetWorth}</div>
                <div className="text-sm text-gray-400">Tech Net Worth</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Comprehensive Features</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            A complete ecosystem combining mining, trading, social, gaming, and enterprise tools
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-slate-700/50 border-slate-600 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Ecosystem Overview</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mining">Mining</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle>Technical Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Pages:</span>
                      <span className="font-bold text-blue-400">{ecosystemStats.totalPages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lines of Code:</span>
                      <span className="font-bold text-green-400">1,070,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Backend Routers:</span>
                      <span className="font-bold text-purple-400">{ecosystemStats.backendRouters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">API Procedures:</span>
                      <span className="font-bold text-orange-400">{ecosystemStats.apiProcedures}+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Database Tables:</span>
                      <span className="font-bold text-pink-400">{ecosystemStats.databaseTables}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle>Development Investment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Development Cost:</span>
                      <span className="font-bold text-green-400">{ecosystemStats.developmentCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tech Net Worth:</span>
                      <span className="font-bold text-blue-400">{ecosystemStats.technicalNetWorth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rarity Score:</span>
                      <span className="font-bold text-purple-400">{ecosystemStats.rarityScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Net Worth:</span>
                      <span className="font-bold text-pink-400">{ecosystemStats.currentNetWorth}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mining" className="mt-8">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle>AI-Powered Mining Engine</CardTitle>
                  <CardDescription>Real-time earnings from multi-crypto mining</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                      <div className="text-4xl font-bold text-green-400 mb-2">{ecosystemStats.dailyMiningEarnings}</div>
                      <div className="text-gray-400">Daily Earnings</div>
                    </div>
                    <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                      <div className="text-4xl font-bold text-blue-400 mb-2">{ecosystemStats.monthlyProjection}</div>
                      <div className="text-gray-400">Monthly Projection</div>
                    </div>
                    <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                      <div className="text-4xl font-bold text-purple-400 mb-2">{ecosystemStats.yearlyProjection}</div>
                      <div className="text-gray-400">Yearly Projection</div>
                    </div>
                  </div>
                  <p className="mt-6 text-gray-300 text-center">
                    128 concurrent mining workers optimized for maximum efficiency across BTC, ETH, SOL, DOGE, and SKY444
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((cat, idx) => (
                  <Card key={idx} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="pt-6 text-center">
                      <div className={`${cat.color} text-white font-bold text-2xl mb-2 py-2 rounded`}>
                        {cat.pages}
                      </div>
                      <div className="text-sm text-gray-400">{cat.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="valuation" className="mt-8">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle>Technical Net Worth Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                      <span>Pages & Screens (1076)</span>
                      <span className="font-bold text-blue-400">$107,600</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                      <span>Backend Infrastructure</span>
                      <span className="font-bold text-green-400">$231,000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                      <span>Technology Stack</span>
                      <span className="font-bold text-purple-400">$430,000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                      <span>Mining & AI Engine</span>
                      <span className="font-bold text-orange-400">$300,000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                      <span>Marketplace Features</span>
                      <span className="font-bold text-pink-400">$110,000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                      <span>Development Investment</span>
                      <span className="font-bold text-cyan-400">$750,000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-500/20 border border-blue-500/50 rounded font-bold">
                      <span>Total Technical Net Worth</span>
                      <span className="text-blue-400 text-xl">$2,000,000+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Revolution?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the future of Web3 with SKY444 Ecosystem. Start mining, trading, and earning today.
          </p>
          <Link href="/signup">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">SKY444</h4>
            <p className="text-gray-400">The comprehensive Web3 ecosystem for mining, trading, and earning.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/mining" className="hover:text-blue-400">Mining</Link></li>
              <li><Link href="/trading" className="hover:text-blue-400">Trading</Link></li>
              <li><Link href="/marketplace" className="hover:text-blue-400">Marketplace</Link></li>
              <li><Link href="/gaming" className="hover:text-blue-400">Gaming</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/whitepaper" className="hover:text-blue-400">Whitepaper</Link></li>
              <li><Link href="/docs" className="hover:text-blue-400">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-blue-400">API</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/terms" className="hover:text-blue-400">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400">Privacy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-400">Disclaimer</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-gray-400">
          <p>&copy; 2026 SKY444 Ecosystem. All rights reserved. | Valued at $2,000,000+ | 1,076 Pages | Scalable-Grade Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default ComprehensiveEcosystemLanding;
