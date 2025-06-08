import React from "react";

interface StockChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  predictedPrice?: number;
  loading: boolean;
  technicalIndicators?: any;
}

export function StockChart({ loading }: StockChartProps) {
  if (loading) {
    return (
      <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-md"></div>
    );
  }

  return (
    <div className="w-full h-[300px] bg-white rounded-md p-4 shadow-sm flex items-center justify-center">
      {/* Chart area intentionally left blank */}
    </div>
  );
}
