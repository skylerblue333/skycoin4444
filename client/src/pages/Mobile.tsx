import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Apple, Smartphone, Star, Users, Zap } from "lucide-react";

export default function Mobile() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4">Available Now</Badge>
          <h1 className="text-5xl font-bold mb-4">SKYCOIN4444 Mobile App</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Trade crypto, chat with AI, and manage your portfolio on the go
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <Button size="lg" className="gap-2">
              <Apple className="h-5 w-5" />
              Download iOS
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Smartphone className="h-5 w-5" />
              Download Android
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Instant Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Trade BTC, ETH, SOL, DOGE, and TRUMP with real-time prices and instant execution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>AI Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chat with Hope AI to get trading signals, market analysis, and investment advice
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Portfolio Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor your holdings, track performance, and receive real-time price alerts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Push Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get instant alerts for price movements, trades, and important platform updates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Smartphone className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>Offline Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View your portfolio and recent transactions even without internet connection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Biometric Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Secure your account with Face ID, Touch ID, or fingerprint authentication
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="bg-accent/5 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">App Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-lg p-4 border">
                <div className="aspect-square bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-center mt-4 text-sm text-muted-foreground">Screenshot {i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>iOS Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>OS:</strong> iOS 14.0 or later</p>
              <p><strong>Size:</strong> 125 MB</p>
              <p><strong>Compatibility:</strong> iPhone 8 and later</p>
              <p><strong>Languages:</strong> 10+ languages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Android Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>OS:</strong> Android 8.0 or later</p>
              <p><strong>Size:</strong> 98 MB</p>
              <p><strong>Compatibility:</strong> Most Android devices</p>
              <p><strong>Languages:</strong> 10+ languages</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Trade On The Go?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Download the SKYCOIN4444 mobile app and start trading instantly
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Apple className="h-5 w-5" />
              App Store
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Smartphone className="h-5 w-5" />
              Google Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
