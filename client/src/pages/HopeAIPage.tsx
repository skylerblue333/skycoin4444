import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainIcon, RocketIcon, StarIcon } from 'lucide-react'; // Using lucide-react for icons

const HopeAIPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://via.placeholder.com/1920x1080/1A0A3A/FFFFFF?text=HOPE_AI_BACKGROUND"
            alt="Hope AI Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Hope AI: Your Intelligent Partner in the Skycoin Ecosystem
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
            Leverage advanced artificial intelligence for optimized crypto mining, smart trading, and personalized insights across your digital journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Link href="/hope-ai/dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Access Hope AI Dashboard <BrainIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/hope-ai/features">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Learn More <RocketIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">How Hope AI Empowers You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <BrainIcon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">AI Mining Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Hope AI intelligently manages your mining operations, maximizing hash power and profitability across multiple cryptocurrencies.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <StarIcon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Smart Trading Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Automate your crypto trading with AI-driven strategies, risk management, and real-time market analysis for optimal returns.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <RocketIcon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Personalized Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Receive tailored recommendations for investments, market trends, and platform usage to enhance your overall experience.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <BrainIcon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Content Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Utilize Hope AI to generate high-quality content for your social profiles, marketplace listings, and more.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <StarIcon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Security & Anomaly Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Hope AI continuously monitors for suspicious activities and potential threats, ensuring the security of your assets and data.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <RocketIcon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Automated Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">Get instant answers and support through Hope AI's intelligent chatbot, resolving your queries efficiently.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-purple-700 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Experience the Power of Hope AI?</h2>
        <p className="text-lg mb-8 opacity-90">Integrate cutting-edge AI into your crypto journey and unlock new levels of efficiency and profitability.</p>
        <Link href="/hope-ai/dashboard">
          <Button className="bg-white text-purple-700 text-lg px-10 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Your AI Journey <BrainIcon className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 px-4 text-center text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Hope AI</h4>
            <p>Your intelligent partner in the Skycoin Ecosystem.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/hope-ai/dashboard" className="hover:text-purple-400">AI Dashboard</Link></li>
              <li><Link href="/mining" className="hover:text-purple-400">AI Mining</Link></li>
              <li><Link href="/trading" className="hover:text-purple-400">AI Trading</Link></li>
              <li><Link href="/support" className="hover:text-purple-400">AI Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
            <p>Email: hopeai@sky444.com</p>
            <p>Follow us for AI updates!</p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 pt-8">
          <p>&copy; {new Date().getFullYear()} Hope AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HopeAIPage;
