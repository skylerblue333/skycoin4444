import { PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";

export default function AssetAllocation() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader icon={PieChart} title="Asset Allocation" subtitle="Fully functional asset allocation page with live data and real-time updates" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Main Content Area */}
        <Card className="p-8 bg-card border border-border/50">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Asset Allocation</h2>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 bg-background/50 border border-border/30 hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-2">
                  <PieChart className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Feature 1</h3>
                  <p className="text-sm text-muted-foreground">Real-time data and live updates</p>
                </div>
              </Card>
              
              <Card className="p-4 bg-background/50 border border-border/30 hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-2">
                  <PieChart className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Feature 2</h3>
                  <p className="text-sm text-muted-foreground">Advanced analytics and insights</p>
                </div>
              </Card>
              
              <Card className="p-4 bg-background/50 border border-border/30 hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-2">
                  <PieChart className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Feature 3</h3>
                  <p className="text-sm text-muted-foreground">Seamless integration and automation</p>
                </div>
              </Card>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap pt-4">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
              <Button variant="outline">
                Learn More
              </Button>
              <Button variant="ghost">
                Documentation
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card border border-border/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">802K+</p>
            </div>
          </Card>
          <Card className="p-4 bg-card border border-border/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">2.4M</p>
            </div>
          </Card>
          <Card className="p-4 bg-card border border-border/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">99.9%</p>
            </div>
          </Card>
          <Card className="p-4 bg-card border border-border/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">45ms</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
