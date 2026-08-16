import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Zap, Wallet } from 'lucide-react'; // Using lucide-react for icons

const CryptoEnhancementsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://via.placeholder.com/1920x1080/0A0A3A/FFFFFF?text=CRYPTO_ENHANCEMENTS_BACKGROUND"
            alt="Crypto Enhancements Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            SKY444 Crypto Enhancements: Powering Your Digital Assets
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
            Explore advanced features for multi-crypto mining, secure wallet management, seamless swapping, and intelligent trading within the Skycoin Ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Link href="/wallet">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Access Your Wallet <WalletIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/swap">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Start Swapping <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">Unlocking New Crypto Possibilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CoinIcon className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Enhanced Multi-Crypto Mining</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Boost your mining power with optimized algorithms and access to exclusive mining pools for higher returns on SKY444, BTC, ETH, SOL, and DOGE.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <WalletIcon className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Advanced Wallet Features</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Securely manage your diverse crypto portfolio with multi-signature support, hardware wallet integration, and detailed transaction history.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Seamless Crypto Swapping</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Instantly swap between various cryptocurrencies with competitive rates and low fees, directly within your SKY444 wallet.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CoinIcon className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Intelligent Trading Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Access AI-powered trading bots, real-time market data, and advanced charting tools to make informed trading decisions.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <WalletIcon className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Staking & Yield Farming</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Participate in staking and yield farming opportunities to earn passive income on your SKY444 and other crypto holdings.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Decentralized Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Influence the future of the SKY444 ecosystem by participating in decentralized governance and voting on key proposals.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-700 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Maximize Your Crypto Potential?</h2>
        <p className="text-lg mb-8 opacity-90">Explore the full suite of SKY444 crypto enhancements and take control of your digital wealth.</p>
        <Link href="/wallet">
          <Button className="bg-white text-blue-700 text-lg px-10 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            Explore Enhancements <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 px-4 text-center text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">SKY444 Crypto</h4>
            <p>Powering the next generation of digital assets.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/mining" className="hover:text-blue-400">Mining</Link></li>
              <li><Link href="/swap" className="hover:text-blue-400">Swap</Link></li>
              <li><Link href="/staking" className="hover:text-blue-400">Staking</Link></li>
              <li><Link href="/governance" className="hover:text-blue-400">Governance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
            <p>Email: crypto@sky444.com</p>
            <p>Follow us for crypto updates!</p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 pt-8">
          <p>&copy; {new Date().getFullYear()} SKY444 Crypto. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CryptoEnhancementsPage;
