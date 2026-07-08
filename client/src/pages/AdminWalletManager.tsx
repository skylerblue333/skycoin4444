import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Copy, ExternalLink, TrendingUp, Wallet, Send, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';

interface WalletInfo {
  address: string;
  type: 'primary' | 'secondary';
  balance: number;
  pendingRewards: number;
  totalEarned: number;
  lastUpdated: number;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  coin: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  txHash?: string;
}

export default function AdminWalletManager() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletInfo[]>([
    {
      address: '0xC2519f4eD39cCea670490bB2Cc07485dD64aC7fb',
      type: 'primary',
      balance: 0,
      pendingRewards: 0,
      totalEarned: 0,
      lastUpdated: Date.now(),
    },
    {
      address: '0x16188a203a715de6b131e273b3a9bcf6d09e7d0a',
      type: 'secondary',
      balance: 0,
      pendingRewards: 0,
      totalEarned: 0,
      lastUpdated: Date.now(),
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo>(wallets[0]);
  const [autoSwapEnabled, setAutoSwapEnabled] = useState(true);
  const [autoDepositEnabled, setAutoDepositEnabled] = useState(true);

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch('/api/mining/wallet/balance', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setWallets(data.wallets || wallets);
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      }
    };

    const interval = setInterval(fetchWalletData, 5000); // Update every 5 seconds
    fetchWalletData();

    return () => clearInterval(interval);
  }, []);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/mining/wallet/transactions?limit=20`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    const interval = setInterval(fetchTransactions, 10000); // Update every 10 seconds
    fetchTransactions();

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalPending = wallets.reduce((sum, w) => sum + w.pendingRewards, 0);
  const totalEarned = wallets.reduce((sum, w) => sum + w.totalEarned, 0);

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Admin Wallet Manager</h1>
        <p className="text-muted-foreground">Manage mining rewards and wallet operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEarned)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Mining destinations</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Details */}
      <Tabs defaultValue="wallets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-4">
          {wallets.map((wallet) => (
            <Card key={wallet.address} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedWallet(wallet)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{wallet.type === 'primary' ? 'Primary Wallet' : 'Secondary Wallet'}</CardTitle>
                      <CardDescription className="font-mono text-sm mt-1">{formatAddress(wallet.address)}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={wallet.type === 'primary' ? 'default' : 'secondary'}>
                    {wallet.type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(wallet.balance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">{formatCurrency(wallet.pendingRewards)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(wallet.totalEarned)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(wallet.address);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://etherscan.io/address/${wallet.address}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Last 20 transactions across all wallets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{tx.coin} Swap</p>
                          <p className="text-xs text-muted-foreground">{formatAddress(tx.from)} → {formatAddress(tx.to)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{tx.amount} {tx.coin}</p>
                        <Badge variant={tx.status === 'confirmed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mining Settings</CardTitle>
              <CardDescription>Configure automatic operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-Swap Setting */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-Swap to ETH</p>
                  <p className="text-sm text-muted-foreground">Automatically swap mined coins to ETH</p>
                </div>
                <Button
                  variant={autoSwapEnabled ? 'default' : 'outline'}
                  onClick={() => setAutoSwapEnabled(!autoSwapEnabled)}
                >
                  {autoSwapEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              {/* Auto-Deposit Setting */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-Deposit to Primary</p>
                  <p className="text-sm text-muted-foreground">Automatically deposit swapped ETH to primary wallet</p>
                </div>
                <Button
                  variant={autoDepositEnabled ? 'default' : 'outline'}
                  onClick={() => setAutoDepositEnabled(!autoDepositEnabled)}
                >
                  {autoDepositEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              {/* Manual Swap */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Manual Swap
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manual Swap</DialogTitle>
                    <DialogDescription>Manually swap coins to ETH</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>From Coin</Label>
                      <Input placeholder="BTC, SOL, DOGE, etc." />
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <Button className="w-full">Execute Swap</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
