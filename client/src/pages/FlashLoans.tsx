import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";

export default function FlashLoans() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader icon={Zap} title="Flash Loans" subtitle="Advanced flash loans with cutting-edge technology" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Main Content Area */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Flash Loans</h2>
            
            {/* Advanced Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 bg-background/80 border border-primary/30 hover:border-primary/80 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20">
                <div className="space-y-3">
                  <Zap className="w-8 h-8 text-primary" />
                  <h3 className="font-bold text-lg">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">Real-time data processing with AI insights</p>
                  <Button size="sm" variant="outline" className="w-full">Explore</Button>
                </div>
              </Card>
              
              <Card className="p-4 bg-background/80 border border-primary/30 hover:border-primary/80 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20">
                <div className="space-y-3">
                  <Zap className="w-8 h-8 text-primary" />
                  <h3 className="font-bold text-lg">Automation Engine</h3>
                  <p className="text-sm text-muted-foreground">Autonomous operations with intelligent decision making</p>
                  <Button size="sm" variant="outline" className="w-full">Configure</Button>
                </div>
              </Card>
              
              <Card className="p-4 bg-background/80 border border-primary/30 hover:border-primary/80 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20">
                <div className="space-y-3">
                  <Zap className="w-8 h-8 text-primary" />
                  <h3 className="font-bold text-lg">Security First</h3>
                  <p className="text-sm text-muted-foreground">Robust encryption and protection</p>
                  <Button size="sm" variant="outline" className="w-full">Secure</Button>
                </div>
              </Card>
            </div>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Processing Speed</p>
                <p className="text-2xl font-bold text-primary">99.9%</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-primary">24/7</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Latency</p>
                <p className="text-2xl font-bold text-primary">&lt;50ms</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Throughput</p>
                <p className="text-2xl font-bold text-primary">10K+/s</p>
              </div>
            </div>
            
            {/* Action Section */}
            <div className="flex gap-4 flex-wrap pt-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
              <Button size="lg" variant="ghost">
                Schedule Demo
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
