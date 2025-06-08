import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SearchForm } from "@/components/SearchForm";
import { StockHeader } from "@/components/StockHeader";
// import { StockChart } from "@/components/StockChart"; // Chart removed
import { PredictionCard } from "@/components/PredictionCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { NewsCard } from "@/components/NewsCard";
import { getStockPrediction } from "@/services/stockService";
import { Activity, TrendingUp, Database, LineChart, Briefcase, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioSidebar } from "@/components/PortfolioSidebar";
import { Header } from "@/components/layout/Header";
import { WelcomeMessage } from "@/components/dashboard/WelcomeMessage";
import { PredictionGrid } from "@/components/dashboard/PredictionGrid";
import { PortfolioProvider } from "@/contexts/PortfolioContext";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleSearch = async (stockSymbol: string, exchange: string) => {
    setLoading(true);
    try {
      const data = await getStockPrediction(stockSymbol, exchange);
      setStockData(data);
      toast({
        title: "Analysis Complete",
        description: `Stock prediction for ${stockSymbol} (${exchange}) completed successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze stock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={handleSearch}
          onTogglePortfolio={() => setShowPortfolio(!showPortfolio)}
          isLoading={loading}
        />

        <div className="flex">
          <PortfolioSidebar open={showPortfolio} onClose={() => setShowPortfolio(false)} />
          
          <main className="flex-1 container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {!stockData && !loading ? (
              <WelcomeMessage />
            ) : (
              <div className="space-y-6">
                <StockHeader
                  stockSymbol={stockData?.stockSymbol || ""}
                  currentPrice={stockData?.prediction?.currentPrice || 0}
                  predictedPrice={stockData?.prediction?.predictedPrice}
                  priceChange={stockData?.prediction?.predictedReturn || 0}
                  loading={loading}
                />

                {/* Chart removed */}

                <PredictionGrid stockData={stockData} loading={loading} />
              </div>
            )}
          </main>
        </div>
      </div>
    </PortfolioProvider>
  );
};

export default Index;
