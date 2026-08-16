import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, Calendar } from "lucide-react";

export default function ScalableBilling() {
  const { user } = useAuth();

  if (!user) return <div className="p-8 text-center">Please login</div>;

  const mockInvoices = [
    { id: "INV-001", date: "2026-07-01", amount: 10000, status: "paid", service: "Scalable Package" },
    { id: "INV-002", date: "2026-06-01", amount: 10000, status: "paid", service: "Scalable Package" },
    { id: "INV-003", date: "2026-05-01", amount: 10000, status: "paid", service: "Scalable Package" },
  ];

  const currentSubscription = {
    plan: "Scalable",
    price: 10000,
    billing: "monthly",
    nextBilling: "2026-08-01",
    status: "active",
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Scalable Billing</h1>

        {/* Current Subscription */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold text-lg">{currentSubscription.plan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-semibold text-lg">${currentSubscription.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing</p>
                <p className="font-semibold text-lg capitalize">{currentSubscription.billing}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="mt-1">{currentSubscription.status}</Badge>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button>Upgrade Plan</Button>
              <Button variant="outline">Manage Billing</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payment-method">Payment Method</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.service}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">${invoice.amount.toLocaleString()}</p>
                          <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-method">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Update Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-2">API Calls</p>
                  <div className="w-full bg-accent rounded-full h-2 mb-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground">6,500 / 10,000 calls</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-2">Storage</p>
                  <div className="w-full bg-accent rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground">420 GB / 1 TB</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
