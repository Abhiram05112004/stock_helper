
import React from "react";
import { Activity, Database, LineChart, Gauge } from "lucide-react";
import { PredictionCard } from "@/components/PredictionCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ConfidenceScore } from "@/components/prediction/ConfidenceScore";

interface PredictionGridProps {
  stockData: any;
  loading: boolean;
}

export function PredictionGrid({ stockData, loading }: PredictionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <RecommendationCard
          action={stockData?.prediction?.action || ""}
          timing={stockData?.prediction?.timing || ""}
          confidence={stockData?.prediction?.confidence || 0}
          predictedReturn={stockData?.prediction?.predictedReturn || 0}
          loading={loading}
        />
      </div>
      
      <PredictionCard
        title="Market Sentiment"
        value={stockData?.prediction?.marketSentiment || "Neutral"}
        description="Based on news analysis"
        progress={stockData?.prediction?.marketSentiment === "Positive" ? 80 : 30}
        progressColor={stockData?.prediction?.marketSentiment === "Positive" ? "#22c55e" : "#ef4444"}
        icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />

      <PredictionCard
        title="Model Accuracy"
        value={`${(stockData?.prediction?.modelAccuracy?.test * 100).toFixed(2)}%`}
        description={`Training: ${(stockData?.prediction?.modelAccuracy?.train * 100).toFixed(2)}%`}
        progress={stockData?.prediction?.modelAccuracy?.test * 100}
        icon={<Database className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />

      <PredictionCard
        title="Volatility"
        value={stockData?.prediction?.volatility?.toString() || "0"}
        description={stockData?.prediction?.volatility < 0.02 ? "Low Risk" : stockData?.prediction?.volatility < 0.04 ? "Medium Risk" : "High Risk"}
        progress={Math.min(stockData?.prediction?.volatility * 1000, 100) || 0}
        progressColor={stockData?.prediction?.volatility < 0.02 ? "#22c55e" : stockData?.prediction?.volatility < 0.04 ? "#f59e0b" : "#ef4444"}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />
      
      <div className="md:col-span-2">
        <ConfidenceScore 
          confidence={stockData?.prediction?.confidence || 0} 
          loading={loading}
        />
      </div>
    </div>
  );
}
