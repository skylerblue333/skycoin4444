import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Coins, Target, AlertCircle } from 'lucide-react';

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  algorithm: string;
  mineable: boolean;
  poolFee: number;
  difficulty: number;
  blockReward: number;
  blockTime: number;
  profitability: number;
  description: string;
}

interface MiningPool {
  name: string;
  coin: string;
  hashrate: string;
  marketShare: number;
  fee: number;
  url: string;
}

const CryptoResearchHub: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [profitabilityData, setProfitabilityData] = useState<any[]>([]);

  const coins: Record<string, CoinData> = {
    BTC: {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 63800,
      marketCap: 1250000000000,
      volume24h: 45000000000,
      change24h: 2.34,
      algorithm: 'SHA-256 (ASIC)',
      mineable: true,
      poolFee: 1.5,
      difficulty: 124.93,
      blockReward: 6.25,
      blockTime: 10,
      profitability: 8.5,
      description: 'Bitcoin is the first and most established cryptocurrency. Mining requires specialized ASIC hardware and significant electricity investment.',
    },
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3891,
      marketCap: 467000000000,
      volume24h: 25000000000,
      change24h: -1.12,
      algorithm: 'Proof-of-Stake',
      mineable: false,
      poolFee: 0,
      difficulty: 0,
      blockReward: 0,
      blockTime: 12,
      profitability: 4.2,
      description: 'Ethereum transitioned to Proof-of-Stake in 2022. Mining is no longer possible; staking is the primary way to earn rewards.',
    },
    SOL: {
      symbol: 'SOL',
      name: 'Solana',
      price: 77.15,
      marketCap: 35000000000,
      volume24h: 3500000000,
      change24h: 5.67,
      algorithm: 'Proof-of-History + PoS',
      mineable: false,
      poolFee: 0,
      difficulty: 0,
      blockReward: 0,
      blockTime: 0.4,
      profitability: 6.8,
      description: 'Solana uses Proof-of-History consensus. Mining is not available; staking provides rewards (5-8% APY).',
    },
    DOGE: {
      symbol: 'DOGE',
      name: 'Dogecoin',
      price: 0.072,
      marketCap: 11000000000,
      volume24h: 1200000000,
      change24h: 3.45,
      algorithm: 'Scrypt (GPU/ASIC)',
      mineable: true,
      poolFee: 1.0,
      difficulty: 0.00000654,
      blockReward: 10000,
      blockTime: 1,
      profitability: 5.3,
      description: 'Dogecoin remains mineable with GPU or ASIC hardware. Lower difficulty makes it accessible for smaller operations.',
    },
    ETC: {
      symbol: 'ETC',
      name: 'Ethereum Classic',
      price: 28.45,
      marketCap: 4200000000,
      volume24h: 450000000,
      change24h: 1.23,
      algorithm: 'Ethash (GPU)',
      mineable: true,
      poolFee: 1.2,
      difficulty: 45000,
      blockReward: 3.2,
      blockTime: 15,
      profitability: 4.7,
      description: 'Ethereum Classic continues with Proof-of-Work. GPU mining is viable with modern graphics cards.',
    },
  };

  const miningPools: MiningPool[] = [
    { name: 'Foundry USA', coin: 'BTC', hashrate: '299 EH/s', marketShare: 30.1, fee: 0, url: 'foundryusa.com' },
    { name: 'AntPool', coin: 'BTC', hashrate: '211 EH/s', marketShare: 18.3, fee: 1.0, url: 'antpool.com' },
    { name: 'ViaBTC', coin: 'BTC', hashrate: '145 EH/s', marketShare: 13.0, fee: 2.0, url: 'viabtc.com' },
    { name: 'F2Pool', coin: 'Multi', hashrate: 'Major', marketShare: 12.0, fee: 1.0, url: 'f2pool.com' },
    { name: 'Ethermine', coin: 'ETC', hashrate: '85 EH/s', marketShare: 25.0, fee: 1.0, url: 'ethermine.org' },
    { name: 'Poolin', coin: 'Multi', hashrate: 'Major', marketShare: 11.0, fee: 1.0, url: 'poolin.com' },
  ];

  useEffect(() => {
    // Generate mock price history
    const history = Array.from({ length: 30 }, (_, i) => ({
      day: i,
      BTC: 63800 + Math.random() * 5000 - 2500,
      ETH: 3891 + Math.random() * 300 - 150,
      SOL: 77.15 + Math.random() * 10 - 5,
      DOGE: 0.072 + Math.random() * 0.01 - 0.005,
    }));
    setPriceHistory(history);

    // Generate profitability data
    const profitData = [
      { hardware: 'Antminer S21', coin: 'BTC', dailyProfit: 23.18, monthlyProfit: 695, roi: 1.18 },
      { hardware: 'RTX 4090', coin: 'ETC', dailyProfit: 8.45, monthlyProfit: 253, roi: 2.5 },
      { hardware: 'RTX 3090', coin: 'DOGE', dailyProfit: 5.32, monthlyProfit: 159, roi: 3.2 },
      { hardware: 'Antminer L7', coin: 'DOGE', dailyProfit: 15.67, monthlyProfit: 470, roi: 1.8 },
    ];
    setProfitabilityData(profitData);
  }, []);

  const selectedCoinData = coins[selectedCoin];
  const coinList = Object.values(coins);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Cryptocurrency Research Hub</h1>
          <p className="text-slate-400">Deep analysis of mining profitability, pool economics, and blockchain technology</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview">Coin Overview</TabsTrigger>
            <TabsTrigger value="mining">Mining Analysis</TabsTrigger>
            <TabsTrigger value="pools">Mining Pools</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          {/* Coin Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Coin Selection */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Select Cryptocurrency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {coinList.map((coin) => (
                    <Button
                      key={coin.symbol}
                      onClick={() => setSelectedCoin(coin.symbol)}
                      variant={selectedCoin === coin.symbol ? 'default' : 'outline'}
                      className="h-auto flex flex-col items-center gap-2 p-4"
                    >
                      <span className="text-lg font-bold">{coin.symbol}</span>
                      <span className="text-sm text-slate-400">${coin.price.toFixed(2)}</span>
                      <span className={`text-xs font-semibold ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Coin Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coin Info */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    {selectedCoinData.name} ({selectedCoinData.symbol})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Description</p>
                    <p className="text-white">{selectedCoinData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Current Price</p>
                      <p className="text-2xl font-bold text-white">${selectedCoinData.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">24h Change</p>
                      <p className={`text-2xl font-bold ${selectedCoinData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedCoinData.change24h >= 0 ? '+' : ''}{selectedCoinData.change24h.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Market Cap</p>
                      <p className="text-lg font-bold text-white">${(selectedCoinData.marketCap / 1e9).toFixed(1)}B</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">24h Volume</p>
                      <p className="text-lg font-bold text-white">${(selectedCoinData.volume24h / 1e9).toFixed(2)}B</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mining Info */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Mining Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mineable</span>
                    <Badge variant={selectedCoinData.mineable ? 'default' : 'secondary'}>
                      {selectedCoinData.mineable ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Algorithm</span>
                    <span className="text-white font-semibold">{selectedCoinData.algorithm}</span>
                  </div>
                  {selectedCoinData.mineable && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pool Fee</span>
                        <span className="text-white font-semibold">{selectedCoinData.poolFee.toFixed(2)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Block Reward</span>
                        <span className="text-white font-semibold">{selectedCoinData.blockReward} {selectedCoinData.symbol}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Block Time</span>
                        <span className="text-white font-semibold">{selectedCoinData.blockTime}s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Profitability Score</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{selectedCoinData.profitability.toFixed(1)}/10</span>
                          <TrendingUp className={`w-4 h-4 ${selectedCoinData.profitability >= 7 ? 'text-green-400' : 'text-yellow-400'}`} />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Price Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">30-Day Price History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line type="monotone" dataKey="BTC" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="ETH" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="SOL" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mining Analysis Tab */}
          <TabsContent value="mining" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Mining Profitability Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Estimated daily, monthly, and yearly profits for different hardware setups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profitabilityData.map((data, idx) => (
                    <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold">{data.hardware}</p>
                          <p className="text-slate-400 text-sm">Mining {data.coin}</p>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          ROI: {data.roi.toFixed(1)} years
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-slate-400 text-xs">Daily Profit</p>
                          <p className="text-lg font-bold text-green-400">${data.dailyProfit.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Monthly Profit</p>
                          <p className="text-lg font-bold text-green-400">${data.monthlyProfit.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Annual Profit</p>
                          <p className="text-lg font-bold text-green-400">${(data.monthlyProfit * 12).toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profitability Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Profit Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitabilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="hardware" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Bar dataKey="dailyProfit" fill="#10b981" name="Daily Profit ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mining Pools Tab */}
          <TabsContent value="pools" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Top Mining Pools 2026</CardTitle>
                <CardDescription className="text-slate-400">
                  Major mining pools by hashrate and market share
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {miningPools.map((pool, idx) => (
                    <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{pool.name}</p>
                        <p className="text-slate-400 text-sm">{pool.coin} • Hashrate: {pool.hashrate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{pool.marketShare.toFixed(1)}%</p>
                        <p className="text-slate-400 text-sm">Fee: {pool.fee}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Blockchain & Mining Fundamentals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">What is Cryptocurrency Mining?</h3>
                  <p className="text-slate-400">
                    Cryptocurrency mining is the process of validating transactions and adding them to the blockchain. Miners compete to solve complex mathematical problems, and the first to solve it gets to add the next block and receive rewards (newly created coins + transaction fees).
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Proof-of-Work vs Proof-of-Stake</h3>
                  <p className="text-slate-400 mb-2">
                    <strong>Proof-of-Work (PoW):</strong> Requires solving computational puzzles. Energy-intensive but highly secure. Used by Bitcoin, Dogecoin, Ethereum Classic.
                  </p>
                  <p className="text-slate-400">
                    <strong>Proof-of-Stake (PoS):</strong> Validators are chosen based on their stake in the network. Energy-efficient and increasingly popular. Used by Ethereum 2.0, Solana.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Mining Difficulty & Hashrate</h3>
                  <p className="text-slate-400">
                    <strong>Difficulty:</strong> Adjusts automatically to maintain consistent block times. Higher difficulty = harder to find valid blocks.
                  </p>
                  <p className="text-slate-400">
                    <strong>Hashrate:</strong> Measures computational power. Higher hashrate = more chances to find valid blocks but also higher electricity costs.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Mining Economics</h3>
                  <p className="text-slate-400">
                    Profitability depends on: hardware efficiency, electricity cost, coin price, mining difficulty, and pool fees. Most profitable coins change frequently based on market conditions.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">2026 Mining Trends</h3>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside">
                    <li>Bitcoin difficulty declining (miner exodus or reduced participation)</li>
                    <li>GPU mining becoming more competitive</li>
                    <li>Staking gaining popularity over traditional mining</li>
                    <li>Pool consolidation continues</li>
                    <li>Profitability pressure from rising electricity costs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CryptoResearchHub;
