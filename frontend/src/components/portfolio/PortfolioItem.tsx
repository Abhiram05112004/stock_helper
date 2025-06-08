
import React from 'react';
import { PortfolioItem as PortfolioItemType } from '@/types/portfolio';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Trash, ArrowUp, ArrowDown } from 'lucide-react';

interface PortfolioItemProps {
  item: PortfolioItemType;
}

export function PortfolioItem({ item }: PortfolioItemProps) {
  const { removeItem } = usePortfolio();
  
  const totalValue = item.quantity * item.currentPrice;
  const totalCost = item.quantity * item.purchasePrice;
  const profitLoss = totalValue - totalCost;
  const profitLossPercent = ((profitLoss / totalCost) * 100).toFixed(2);
  
  const isProfit = profitLoss >= 0;
  const profitLossColor = isProfit ? 'text-green-500' : 'text-red-500';
  const ProfitLossIcon = isProfit ? ArrowUp : ArrowDown;

  return (
    <div className="flex flex-col border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{item.symbol}</h3>
          <p className="text-sm text-muted-foreground">{item.name}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => removeItem(item.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Quantity</p>
          <p>{item.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Value</p>
          <p>₹{totalValue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Purchase Price</p>
          <p>₹{item.purchasePrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Price</p>
          <p>₹{item.currentPrice.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <ProfitLossIcon className={`h-4 w-4 ${profitLossColor} mr-1`} />
        <span className={`${profitLossColor} font-medium`}>
          {isProfit ? '+' : ''}{profitLossPercent}% (₹{Math.abs(profitLoss).toFixed(2)})
        </span>
      </div>
    </div>
  );
}
