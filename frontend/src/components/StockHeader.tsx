
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StockHeaderProps {
  stockSymbol: string;
  currentPrice: number;
  predictedPrice?: number;
  priceChange: number;
  marketSentiment?: string;
  loading: boolean;
}

export function StockHeader({ 
  stockSymbol, 
  currentPrice, 
  predictedPrice,
  priceChange,
  marketSentiment,
  loading 
}: StockHeaderProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = priceChange >= 0;
  const priceChangeColor = isPositive ? 'text-stock-gain' : 'text-stock-loss';
  const predictedChangeColor = predictedPrice && predictedPrice > currentPrice ? 'text-stock-gain' : 'text-stock-loss';
  
  return (
    <Card>
      <CardContent className="py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{stockSymbol}</h1>
            
            {marketSentiment && (
              <Badge 
                variant={marketSentiment === 'Positive' ? 'default' : marketSentiment === 'Negative' ? 'destructive' : 'outline'}
              >
                {marketSentiment} Market Sentiment
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Title</span>
              <div className="text-xl font-semibold">{stockSymbol} Stock</div>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <div className={`text-2xl font-semibold ${priceChangeColor}`}>
                ₹{currentPrice.toFixed(2)}
              </div>
              <div className={`flex items-center gap-1 text-xs ${priceChangeColor}`}>
                {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
            
            {predictedPrice && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Predicted Price</span>
                <div className={`text-2xl font-semibold ${predictedChangeColor}`}>
                  ₹{predictedPrice.toFixed(2)}
                </div>
                {predictedPrice && (
                  <div className={`text-xs ${predictedChangeColor}`}>
                    {predictedPrice > currentPrice ? 'Potential Gain' : 'Potential Loss'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
