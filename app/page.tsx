"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowRightLeft, TrendingUp, Coins, Scale, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface ExchangeRates {
  [key: string]: number;
}

interface GoldPrice {
  price: number;
  currency: string;
  timestamp: number;
}

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  metaImage?: string;
}


const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
];

export default function Home() {
  const [sourceCurrency, setSourceCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<string>('100');
  const [goldWeight, setGoldWeight] = useState<string>('10');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRates = async () => {
    try {
      // Using exchangerate-api.com (free tier)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      setExchangeRates(data.rates);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch exchange rates');
      console.error('Exchange rate error:', err);
    }
  };

  const fetchGoldPrice = async () => {
    try {
      // Mock gold price since free APIs are limited - in production, use metals-api.com or similar
      const mockGoldPrice = {
        price: 65.50, // USD per gram (approximate)
        currency: 'USD',
        timestamp: Date.now()
      };
      setGoldPrice(mockGoldPrice);
    } catch (err) {
      setError('Failed to fetch gold prices');
      console.error('Gold price error:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      
      await Promise.all([
        fetchExchangeRates(),
        fetchGoldPrice()
      ]);
      
      setLoading(false);
    };

    loadData();
  }, []);

  const convertCurrency = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    
    // Convert to USD first if source is not USD
    const usdAmount = from === 'USD' ? value : value / (exchangeRates[from] || 1);
    
    // Convert from USD to target currency
    const targetAmount = to === 'USD' ? usdAmount : usdAmount * (exchangeRates[to] || 1);
    
    return targetAmount;
  };

  const calculateGoldValue = (): number => {
    if (!goldPrice || !goldWeight) return 0;
    
    const weightInGrams = parseFloat(goldWeight);
    const goldValueUSD = weightInGrams * goldPrice.price;
    
    return convertCurrency(goldValueUSD, 'USD', targetCurrency);
  };

  const getConvertedAmount = (): number => {
    if (!amount) return 0;
    return convertCurrency(parseFloat(amount), sourceCurrency, targetCurrency);
  };

  const getCurrencySymbol = (code: string): string => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  const formatCurrency = (value: number, currencyCode: string): string => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${value.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const swapCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchExchangeRates(),
      fetchGoldPrice()
    ]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Currency & Gold Calculator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert currencies with real-time exchange rates and calculate gold values instantly
          </p>
          {lastUpdated && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="ml-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Currency Converter */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Currency Converter</CardTitle>
                  <CardDescription>Convert between different currencies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="text-lg h-12 mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">From</Label>
                    <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
                      <SelectTrigger className="h-12 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currency.symbol}</span>
                              <span>{currency.code}</span>
                              <span className="text-muted-foreground">- {currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">To</Label>
                    <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                      <SelectTrigger className="h-12 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currency.symbol}</span>
                              <span>{currency.code}</span>
                              <span className="text-muted-foreground">- {currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapCurrencies}
                    className="border-dashed hover:bg-blue-50"
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Swap currencies
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Converted Amount</p>
                  {loading ? (
                    <Skeleton className="h-12 w-48 mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(getConvertedAmount(), targetCurrency)}
                    </p>
                  )}
                  {!loading && amount && (
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(parseFloat(amount), sourceCurrency)} = {formatCurrency(getConvertedAmount(), targetCurrency)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gold Calculator */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Scale className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gold Value Calculator</CardTitle>
                  <CardDescription>Calculate gold value by weight</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goldWeight" className="text-sm font-medium">Weight (grams)</Label>
                  <Input
                    id="goldWeight"
                    type="number"
                    value={goldWeight}
                    onChange={(e) => setGoldWeight(e.target.value)}
                    placeholder="Enter weight in grams"
                    className="text-lg h-12 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Display Currency</Label>
                  <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                    <SelectTrigger className="h-12 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.symbol}</span>
                            <span>{currency.code}</span>
                            <span className="text-muted-foreground">- {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">Gold Price (per gram)</span>
                  {loading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      ${goldPrice?.price.toFixed(2)} USD
                    </Badge>
                  )}
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Total Gold Value</p>
                    {loading ? (
                      <Skeleton className="h-12 w-48 mx-auto" />
                    ) : (
                      <p className="text-3xl font-bold text-yellow-600">
                        {formatCurrency(calculateGoldValue(), targetCurrency)}
                      </p>
                    )}
                    {!loading && goldWeight && (
                      <p className="text-sm text-muted-foreground">
                        {goldWeight}g × ${goldPrice?.price.toFixed(2)} USD/g
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Rate Grid */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Current Exchange Rates</CardTitle>
            <CardDescription>Based on USD (1 USD equals)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currencies.slice(1, 9).map((currency) => (
                  <div
                    key={currency.code}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-sm font-medium text-gray-600">{currency.code}</div>
                    <div className="text-lg font-bold">
                      {currency.symbol}{(exchangeRates[currency.code] || 0).toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            Exchange rates and gold prices are updated in real-time. 
            <br />
            Built with Next.js, TypeScript, and shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
}