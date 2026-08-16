import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Send, Plus, Eye, EyeOff, TrendingUp, Wallet, CreditCard, History, Settings } from 'lucide-react';

interface WalletBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake';
  currency: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  address?: string;
}

const mockBalances: WalletBalance[] = [
  { symbol: 'SKY4', name: 'SKY444', balance: 5000, value: 12500, change24h: 8.5, icon: '🚀', color: '#FF6B9D' },
  { symbol: 'DOGE', name: 'Dogecoin', balance: 2500, value: 192.50, change24h: 3.2, icon: '🐕', color: '#C1A633' },
  { symbol: 'TRUMP', name: 'Trump Token', balance: 1000, value: 8420, change24h: -2.1, icon: '🗽', color: '#FF0000' },
  { symbol: 'ETH', name: 'Ethereum', balance: 0.5, value: 1850, change24h: 5.8, icon: '⟠', color: '#627EEA' },
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.02, value: 1243.62, change24h: 2.3, icon: '₿', color: '#F7931A' },
];

const mockTransactions: Transaction[] = [
  { id: '1', type: 'receive', currency: 'SKY4', amount: 500, date: '2026-07-03', status: 'completed', address: '0x1234...5678' },
  { id: '2', type: 'send', currency: 'DOGE', amount: 100, date: '2026-07-02', status: 'completed', address: '0x9876...5432' },
  { id: '3', type: 'swap', currency: 'ETH', amount: 0.1, date: '2026-07-01', status: 'completed' },
  { id: '4', type: 'stake', currency: 'SKY4', amount: 1000, date: '2026-06-30', status: 'completed' },
  { id: '5', type: 'receive', currency: 'TRUMP', amount: 250, date: '2026-06-29', status: 'pending' },
];

const chartData = [
  { date: 'Jun 1', value: 18000 },
  { date: 'Jun 8', value: 19500 },
  { date: 'Jun 15', value: 18800 },
  { date: 'Jun 22', value: 21200 },
  { date: 'Jun 29', value: 23100 },
  { date: 'Jul 3', value: 24206.12 },
];

export default function UnifiedWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const totalValue = mockBalances.reduce((sum, b) => sum + b.value, 0);
  const totalChange = mockBalances.reduce((sum, b) => sum + (b.value * b.change24h / 100), 0);
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  const portfolioDistribution = mockBalances.map(b => ({
    name: b.symbol,
    value: b.value,
    color: b.color,
  }));

  const COLORS = mockBalances.map(b => b.color);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Unified Wallet</h1>
            <p className="text-gray-400">Manage all your crypto assets in one place</p>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Balance</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-5xl font-bold text-white">
                    {showBalance ? `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {showBalance ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>
              <div className={`text-right ${totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <div className="flex items-center gap-1 justify-end mb-2">
                  {totalChangePercent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                  <span className="text-2xl font-bold">{Math.abs(totalChangePercent).toFixed(2)}%</span>
                </div>
                <p className="text-sm">${Math.abs(totalChange).toFixed(2)} (24h)</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              <Button className="bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send
              </Button>
              <Button className="bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2">
                <ArrowDownLeft className="w-4 h-4" />
                Receive
              </Button>
              <Button className="bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Swap
              </Button>
              <Button className="bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Buy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Portfolio Chart */}
              <Card className="col-span-2 bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B9D" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FF6B9D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569' }}
                        labelStyle={{ color: '#F1F5F9' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FF6B9D"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Portfolio Distribution */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={portfolioDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {portfolioDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569' }}
                        labelStyle={{ color: '#F1F5F9' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Assets */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBalances.map(balance => (
                    <div
                      key={balance.symbol}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                      onClick={() => setSelectedCurrency(balance.symbol)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">{balance.icon}</div>
                        <div>
                          <p className="font-semibold text-white">{balance.name}</p>
                          <p className="text-sm text-gray-400">{balance.balance} {balance.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">${balance.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <p className={`text-sm ${balance.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {balance.change24h >= 0 ? '+' : ''}{balance.change24h}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">All Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockBalances.map(balance => (
                    <div key={balance.symbol} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{balance.icon}</div>
                        <div>
                          <p className="font-semibold text-white">{balance.name}</p>
                          <p className="text-xs text-gray-400">{balance.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{balance.balance}</p>
                        <p className="text-sm text-gray-400">${balance.value.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Transaction History
                  </CardTitle>
                  <Button variant="outline" className="border-slate-600 text-gray-300">
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${
                          tx.type === 'send' ? 'bg-red-500/20' :
                          tx.type === 'receive' ? 'bg-green-500/20' :
                          tx.type === 'swap' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                        }`}>
                          {tx.type === 'send' && <ArrowUpRight className="w-5 h-5 text-red-400" />}
                          {tx.type === 'receive' && <ArrowDownLeft className="w-5 h-5 text-green-400" />}
                          {tx.type === 'swap' && <ArrowUpRight className="w-5 h-5 text-blue-400 rotate-90" />}
                          {tx.type === 'stake' && <TrendingUp className="w-5 h-5 text-purple-400" />}
                        </div>
                        <div>
                          <p className="font-semibold text-white capitalize">{tx.type}</p>
                          <p className="text-xs text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{tx.amount} {tx.currency}</p>
                        <p className={`text-xs ${tx.status === 'completed' ? 'text-green-400' : tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Gain/Loss</p>
                      <p className="text-2xl font-bold text-green-400">+$2,206.12</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Return %</p>
                      <p className="text-2xl font-bold text-green-400">+10.08%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
                      <p className="text-2xl font-bold text-white">47</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Active Assets</p>
                      <p className="text-2xl font-bold text-white">5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
