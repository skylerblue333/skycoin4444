import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

const steps = [
  {
    title: "Welcome to SKY444 Ecosystem",
    description: "Discover the future of decentralized finance, mining, and digital interaction. This walkthrough will guide you through the core features.",
    image: "https://via.placeholder.com/800x400/0A0A0A/FFFFFF?text=Welcome_to_SKY444",
    link: "/dashboard",
    linkText: "Go to Dashboard",
  },
  {
    title: "AI-Powered Crypto Mining",
    description: "Learn how to activate your AI mining rigs and start earning SKY444, BTC, ETH, SOL, and DOGE daily. Optimize your power for maximum returns.",
    image: "https://via.placeholder.com/800x400/0A0A0A/FFFFFF?text=AI_Mining",
    link: "/mining",
    linkText: "Start Mining",
  },
  {
    title: "Explore the Decentralized Marketplace",
    description: "Buy, sell, and trade unique digital and physical assets using SKY444. Discover rare items and connect with a global community.",
    image: "https://via.placeholder.com/800x400/0A0A0A/FFFFFF?text=Marketplace",
    link: "/marketplace",
    linkText: "Browse Marketplace",
  },
  {
    title: "Connect & Socialize",
    description: "Engage with the community, share your mining progress, stream live content, and participate in exciting games. Build your network and earn rewards.",
    image: "https://via.placeholder.com/800x400/0A0A0A/FFFFFF?text=Social_Gaming",
    link: "/social",
    linkText: "Join Community",
  },
  {
    title: "Manage Your Multi-Crypto Wallet",
    description: "Securely store, send, and receive all your cryptocurrencies. Track your net worth and transaction history with ease.",
    image: "https://via.placeholder.com/800x400/0A0A0A/FFFFFF?text=Crypto_Wallet",
    link: "/wallet",
    linkText: "View Wallet",
  },
  {
    title: "Advanced Analytics & Insights",
    description: "Monitor your performance with detailed analytics. Understand market trends, track your net worth, and optimize your strategies.",
    image: "https://via.placeholder.com/800x400/0A0A0A/FFFFFF?text=Analytics",
    link: "/analytics",
    linkText: "Check Analytics",
  },
];

const WalkthroughPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-sky-400 mb-2">{step.title}</CardTitle>
          <p className="text-gray-300">Step {currentStep + 1} of {steps.length}</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <img src={step.image} alt={step.title} className="w-full rounded-lg shadow-md" />
          <p className="text-lg text-center text-gray-200">{step.description}</p>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="bg-sky-500 hover:bg-sky-600 text-white">
                Next <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Link href={step.link}>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  {step.linkText} <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
          {currentStep === steps.length - 1 && (
            <div className="mt-4 text-center">
              <p className="text-gray-400">You've completed the walkthrough! Ready to dive in?</p>
              <Link href="/dashboard">
                <Button variant="link" className="text-sky-400 hover:text-sky-300">
                  Skip to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalkthroughPage;
