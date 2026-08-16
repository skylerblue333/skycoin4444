import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, Zap, DollarSign } from 'lucide-react';

interface HardwareSpec {
  name: string;
  hashrate: number; // TH/s for ASIC, MH/s for GPU
  power: number; // Watts
  cost: number; // USD
  algorithm: string;
}

interface CoinSpec {
  symbol: string;
  price: number;
  blockReward: number;
  blockTime: number; // seconds
  difficulty: number;
}

const MiningCalculator: React.FC = () => {
  const [selectedHardware, setSelectedHardware] = useState<string>('antminer-s21');
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [electricityCost, setElectricityCost] = useState<number>(0.10); // USD per kWh
  const [poolFee, setPoolFee] = useState<number>(1.5); // Percentage
  const [quantity, setQuantity] = useState<number>(1);
  const [customHashrate, setCustomHashrate] = useState<number | null>(null);
  const [customPower, setCustomPower] = useState<number | null>(null);

  const hardware: Record<string, HardwareSpec> = {
    'antminer-s21': {
      name: 'Antminer S21 (200 TH/s)',
      hashrate: 200,
      power: 3500,
      cost: 10000,
      algorithm: 'SHA-256',
    },
    'antminer-s19': {
      name: 'Antminer S19 Pro (110 TH/s)',
      hashrate: 110,
      power: 1920,
      cost: 5000,
      algorithm: 'SHA-256',
    },
    'rtx-4090': {
      name: 'RTX 4090 (100 MH/s)',
      hashrate: 100,
      power: 450,
      cost: 1600,
      algorithm: 'Ethash',
    },
    'rtx-3090': {
      name: 'RTX 3090 (80 MH/s)',
      hashrate: 80,
      power: 350,
      cost: 1200,
      algorithm: 'Ethash',
    },
    'antminer-l7': {
      name: 'Antminer L7 (500 MH/s)',
      hashrate: 500,
      power: 3425,
      cost: 3000,
      algorithm: 'Scrypt',
    },
    'custom': {
      name: 'Custom Hardware',
      hashrate: 100,
      power: 300,
      cost: 1000,
      algorithm: 'Custom',
    },
  };

  const coins: Record<string, CoinSpec> = {
    BTC: {
      symbol: 'BTC',
      price: 63800,
      blockReward: 6.25,
      blockTime: 600, // 10 minutes
      difficulty: 124.93,
    },
    DOGE: {
      symbol: 'DOGE',
      price: 0.072,
      blockReward: 10000,
      blockTime: 60, // 1 minute
      difficulty: 0.00000654,
    },
    ETC: {
      symbol: 'ETC',
      price: 28.45,
      blockReward: 3.2,
      blockTime: 900, // 15 seconds average
      difficulty: 45000,
    },
    LTC: {
      symbol: 'LTC',
      price: 89.50,
      blockReward: 6.25,
      blockTime: 150, // 2.5 minutes
      difficulty: 0.00000654,
    },
  };

  const spec = hardware[selectedHardware];
  const coin = coins[selectedCoin];

  const hashrate = customHashrate !== null ? customHashrate : spec.hashrate;
  const power = customPower !== null ? customPower : spec.power;

  const calculations = useMemo(() => {
    // Calculate daily earnings
    const blocksPerDay = (86400 / coin.blockTime); // 86400 seconds in a day
    const totalHashrate = hashrate * quantity;
    
    // Simplified calculation: proportion of blocks won based on hashrate
    // In reality, this depends on network hashrate, but we'll use a simplified model
    const dailyRewardCoins = (coin.blockReward * blocksPerDay * totalHashrate) / 1000000; // Simplified
    const dailyRewardUSD = dailyRewardCoins * coin.price;

    // Calculate costs
    const dailyElectricityCost = (power * quantity * 24 / 1000) * electricityCost; // kWh to cost
    const dailyPoolFee = (dailyRewardUSD * poolFee) / 100;
    const dailyProfit = dailyRewardUSD - dailyElectricityCost - dailyPoolFee;

    // Monthly and yearly
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;

    // ROI calculation
    const totalHardwareCost = spec.cost * quantity;
    const roi = totalHardwareCost > 0 ? totalHardwareCost / (dailyProfit * 365) : 0;

    // Breakeven point
    const breakevenDays = totalHardwareCost > 0 ? totalHardwareCost / dailyProfit : 0;

    // Generate profitability over time
    const profitOverTime = Array.from({ length: 365 }, (_, day) => ({
      day: day + 1,
      profit: (dailyProfit * (day + 1)) - totalHardwareCost,
      cumulative: dailyProfit * (day + 1),
    }));

    return {
      dailyRewardCoins,
      dailyRewardUSD,
      dailyElectricityCost,
      dailyPoolFee,
      dailyProfit,
      monthlyProfit,
      yearlyProfit,
      totalHardwareCost,
      roi,
      breakevenDays,
      profitOverTime,
    };
  }, [hashrate, power, quantity, coin, electricityCost, poolFee, spec.cost]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            Mining Profitability Calculator
          </h1>
          <p className="text-slate-400">Calculate your potential earnings based on hardware and electricity costs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hardware Selection */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Mining Hardware</Label>
                  <Select value={selectedHardware} onValueChange={setSelectedHardware}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {Object.entries(hardware).map(([key, hw]) => (
                        <SelectItem key={key} value={key} className="text-white">
                          {hw.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Coin Selection */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Cryptocurrency</Label>
                  <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {Object.entries(coins).map(([key, c]) => (
                        <SelectItem key={key} value={key} className="text-white">
                          {c.symbol} (${c.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Electricity Cost */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Electricity Cost ($/kWh)</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[electricityCost]}
                      onValueChange={(v) => setElectricityCost(v[0])}
                      min={0.01}
                      max={0.50}
                      step={0.01}
                      className="flex-1"
                    />
                    <span className="text-white font-semibold w-12 text-right">${electricityCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Pool Fee */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Pool Fee (%)</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[poolFee]}
                      onValueChange={(v) => setPoolFee(v[0])}
                      min={0}
                      max={5}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-white font-semibold w-12 text-right">{poolFee.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Custom Hardware */}
                {selectedHardware === 'custom' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Hashrate (TH/s or MH/s)</Label>
                      <Input
                        type="number"
                        value={customHashrate || 100}
                        onChange={(e) => setCustomHashrate(parseFloat(e.target.value) || 100)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Power Consumption (Watts)</Label>
                      <Input
                        type="number"
                        value={customPower || 300}
                        onChange={(e) => setCustomPower(parseFloat(e.target.value) || 300)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </>
                )}

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Recalculate
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Daily Profit</p>
                      <p className="text-3xl font-bold text-green-400">${calculations.dailyProfit.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Monthly Profit</p>
                      <p className="text-3xl font-bold text-green-400">${calculations.monthlyProfit.toFixed(0)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <div>
                    <p className="text-slate-400 text-sm">Annual Profit</p>
                    <p className="text-3xl font-bold text-green-400">${calculations.yearlyProfit.toFixed(0)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <div>
                    <p className="text-slate-400 text-sm">ROI (Years)</p>
                    <p className={`text-3xl font-bold ${calculations.roi < 2 ? 'text-green-400' : calculations.roi < 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {calculations.roi.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400">Gross Revenue ({coin.symbol})</span>
                    <span className="text-white font-semibold">${calculations.dailyRewardUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400">Electricity Cost</span>
                    <span className="text-red-400 font-semibold">-${calculations.dailyElectricityCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400">Pool Fee ({poolFee}%)</span>
                    <span className="text-red-400 font-semibold">-${calculations.dailyPoolFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-slate-700 px-3 rounded">
                    <span className="text-white font-semibold">Net Profit</span>
                    <span className="text-green-400 font-bold text-lg">${calculations.dailyProfit.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profitability Over Time */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">12-Month Profitability Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={calculations.profitOverTime.filter((_, i) => i % 30 === 0)}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningCalculator;
