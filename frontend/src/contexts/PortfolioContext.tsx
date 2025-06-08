
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PortfolioItem, PortfolioState } from '@/types/portfolio';
import { useToast } from '@/components/ui/use-toast';

const PortfolioContext = createContext<PortfolioState | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);

  // Load portfolio from localStorage on initial render
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      try {
        setItems(JSON.parse(savedPortfolio));
      } catch (e) {
        console.error('Failed to parse portfolio data', e);
      }
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('portfolio', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item: Omit<PortfolioItem, 'id' | 'dateAdded'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
    };
    
    setItems((prev) => [...prev, newItem]);
    toast({
      title: "Stock Added",
      description: `${item.symbol} has been added to your portfolio.`,
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find(item => item.id === id);
      const newItems = prev.filter(item => item.id !== id);
      
      if (itemToRemove) {
        toast({
          title: "Stock Removed",
          description: `${itemToRemove.symbol} has been removed from your portfolio.`,
        });
      }
      
      return newItems;
    });
  };

  const updateItem = (id: string, updates: Partial<PortfolioItem>) => {
    setItems((prev) => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateItem,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
