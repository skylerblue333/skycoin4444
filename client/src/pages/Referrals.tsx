import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Share2, TrendingUp, Users, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Referrals() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return <div className="p-8 text-center">Please login to access Referral Program</div>;

  const referralCode = `SKY-${user.id?.substring(0, 8).toUpperCase() || 'DEMO'}`;
  const referralLink = `https://skycoin4444.com?ref=${referralCode}`;

  const mockStats = {
    totalReferrals: 47,
    activeReferrals: 32,
    totalEarnings: 4750,
    pendingEarnings: 850,
  };

  const mockReferrals = [
    { id: 1, name: "John Doe", email: "john@example.com", date: "2026-07-01", status: "active", earnings: 150 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", date: "2026-06-28", status: "active", earnings: 200 },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", date: "2026-06-25", status: "inactive", earnings: 0 },
    { id: 4, name: "Alice Brown", email: "alice@example.com", date: "2026-06-20", status: "active", earnings: 175 },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
          <p className="text-muted-foreground">Earn 10% commission on every referral</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalReferrals}</div>
              <p className="text-xs text-muted-foreground">{mockStats.activeReferrals} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockStats.totalEarnings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockStats.pendingEarnings}</div>
              <p className="text-xs text-muted-foreground">Next payout</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Commission Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10%</div>
              <p className="text-xs text-muted-foreground">Per referral</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-accent/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Referral Code</p>
              <p className="font-mono font-bold text-lg">{referralCode}</p>
            </div>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">1</span>
                </div>
                <p className="font-semibold mb-2">Share Your Link</p>
                <p className="text-sm text-muted-foreground">Send your unique referral link to friends</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-purple-600">2</span>
                </div>
                <p className="font-semibold mb-2">They Sign Up</p>
                <p className="text-sm text-muted-foreground">They create an account using your link</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-green-600">3</span>
                </div>
                <p className="font-semibold mb-2">Earn Commission</p>
                <p className="text-sm text-muted-foreground">Get 10% of their first purchase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReferrals.map((ref) => (
                    <tr key={ref.id} className="border-b hover:bg-accent/5">
                      <td className="py-3 px-4">{ref.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{ref.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{ref.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={ref.status === "active" ? "default" : "secondary"}>
                          {ref.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold">${ref.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
