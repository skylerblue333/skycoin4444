import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightIcon, LightningBoltIcon, RocketIcon, StarIcon } from '@radix-ui/react-icons';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://via.placeholder.com/1920x1080/0A0A0A/FFFFFF?text=SKYCOIN_HERO_BACKGROUND"
            alt="Skycoin Ecosystem Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            SKY444: The $2M Scalable Ecosystem for AI, Crypto & Web3
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
            Unlock a $2M enterprise-grade platform with AI-powered crypto mining, a vibrant marketplace, social connectivity, and immersive gaming. Built with 1.07M+ Lines of Code.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Link href="/dashboard">
              <Button className="bg-sky-500 hover:bg-sky-600 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Start Mining Now <LightningBoltIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/whitepaper">
              <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Read Whitepaper <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">Unrivaled Features, Limitless Possibilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <LightningBoltIcon className="h-10 w-10 text-sky-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">AI-Powered Mining</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Mine SKY444, BTC, ETH, SOL, DOGE with cutting-edge AI algorithms for maximum efficiency and profit. Over 1.07M+ Lines of Code power this enterprise-grade platform.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <StarIcon className="h-10 w-10 text-sky-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Decentralized Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Buy, sell, and trade goods & services using SKY444 and other cryptocurrencies in a secure environment.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <RocketIcon className="h-10 w-10 text-sky-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Social & Gaming Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Connect with friends, stream live, play games, and earn crypto rewards in an immersive social ecosystem.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <LightningBoltIcon className="h-10 w-10 text-sky-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Multi-Crypto Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Securely manage your BTC, ETH, SOL, DOGE, and SKY444 holdings with advanced wallet features.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <StarIcon className="h-10 w-10 text-sky-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Gain insights into your mining performance, net worth, and market trends with powerful analytics tools.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <RocketIcon className="h-10 w-10 text-sky-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Scalable-Grade Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Your assets and data are protected by state-of-the-art security protocols and blockchain technology.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-20 px-4 bg-gray-900 text-center">
        <h2 className="text-4xl font-bold mb-12">SKY444 Tokenomics</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-8 text-gray-300">SKY444 is the native utility token powering a $2M enterprise ecosystem. Designed for sustainable growth and value creation, it offers diverse utility within the platform, backed by 1.07M+ Lines of Code.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Token Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-left text-gray-300">
                  <li>Mining Rewards: 40%</li>
                  <li>Ecosystem Development: 25%</li>
                  <li>Team & Advisors: 15%</li>
                  <li>Marketing & Community: 10%</li>
                  <li>Liquidity Pool: 5%</li>
                  <li>Reserve: 5%</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Token Utility</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-left text-gray-300">
                  <li>Mining Rewards & Fees</li>
                  <li>Staking & Governance</li>
                  <li>Marketplace Currency</li>
                  <li>Premium Feature Access</li>
                  <li>Transaction Fees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">Our Vision: The SKY444 Roadmap</h2>
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-sky-500 hidden md:block"></div>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              <div className="md:w-5/12 text-right p-4">
                <h3 className="text-2xl font-semibold text-sky-400">Phase 1: Core Platform Launch (Q3 2026)</h3>
                <p className="text-gray-300">Frontend & Backend deployment, Multi-crypto wallet, AI-powered mining, User authentication, Social feed, Stripe integration.</p>
              </div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-6 h-6 bg-sky-500 rounded-full border-4 border-gray-900"></div>
              </div>
              <div className="md:w-5/12 p-4"></div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              <div className="md:w-5/12 p-4"></div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-6 h-6 bg-sky-500 rounded-full border-4 border-gray-900"></div>
              </div>
              <div className="md:w-5/12 text-left p-4">
                <h3 className="text-2xl font-semibold text-sky-400">Phase 2: Ecosystem Expansion (Q4 2026)</h3>
                <p className="text-gray-300">Full marketplace, Live streaming, Gaming platform, Advanced analytics, Community governance.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              <div className="md:w-5/12 text-right p-4">
                <h3 className="text-2xl font-semibold text-sky-400">Phase 3: Decentralization & AI Enhancement (Q1 2027)</h3>
                <p className="text-gray-300">On-chain governance, Advanced AI trading bots, DEX integration, Cross-chain compatibility, Mobile app launch.</p>
              </div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-6 h-6 bg-sky-500 rounded-full border-4 border-gray-900"></div>
              </div>
              <div className="md:w-5/12 p-4"></div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              <div className="md:w-5/12 p-4"></div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-6 h-6 bg-sky-500 rounded-full border-4 border-gray-900"></div>
              </div>
              <div className="md:w-5/12 text-left p-4">
                <h3 className="text-2xl font-semibold text-sky-400">Phase 4: Global Adoption & Innovation (Q2 2027 onwards)</h3>
                <p className="text-gray-300">Strategic partnerships, New market expansion, Quantum-resistant crypto research, Continuous feature development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-sky-700 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Join the Revolution?</h2>
        <p className="text-lg mb-8 opacity-90">Experience the power of a truly integrated $2M digital ecosystem. Start your journey with SKY444 today, backed by 1.07M+ Lines of Code!</p>
        <Link href="/dashboard">
          <Button className="bg-white text-sky-700 text-lg px-10 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            Get Started Now <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 px-4 text-center text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">SKY444 Ecosystem</h4>
            <p>The future of decentralized finance and digital interaction.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/whitepaper" className="hover:text-sky-400">Whitepaper</Link></li>
              <li><Link href="/terms" className="hover:text-sky-400">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-400">Privacy Policy</Link></li>
              <li><Link href="/dashboard" className="hover:text-sky-400">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
            <p>Email: support@sky444.com</p>
            <p>Follow us on social media!</p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 pt-8">
          <p>&copy; {new Date().getFullYear()} SKY444. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
