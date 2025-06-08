
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecommendationCardProps {
  action: "BUY" | "SELL" | "";
  timing: string;
  confidence: number;
  predictedReturn: number;
  loading: boolean;
}

export function RecommendationCard({
  action,
  timing,
  confidence,
  predictedReturn,
  loading,
}: RecommendationCardProps) {
  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="h-6 bg-gray-200 animate-pulse rounded-md w-1/3"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="h-14 bg-gray-200 animate-pulse rounded-lg w-1/3"></div>
            <div className="h-14 bg-gray-200 animate-pulse rounded-lg w-1/3"></div>
          </div>
          <div className="h-5 mt-4 bg-gray-200 animate-pulse rounded-md w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>Recommendation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ActionCard action={action} />
          <div className="space-y-1">
            <div className="text-lg font-medium">{timing} Opportunity</div>
            <div className="flex items-center space-x-2">
              <div className={`text-sm ${predictedReturn >= 0 ? "text-stock-gain" : "text-stock-loss"}`}>
                <div className="flex items-center">
                  {predictedReturn >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  <span>{Math.abs(predictedReturn).toFixed(2)}% predicted return</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {confidence.toFixed(1)}% prediction confidence
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({ action }: { action: "BUY" | "SELL" | "" }) {
  if (!action) return null;
  
  const isBuy = action === "BUY";
  const bgColor = isBuy ? "bg-green-100" : "bg-red-100";
  const textColor = isBuy ? "text-green-700" : "text-red-700";
  const icon = isBuy ? (
    <ArrowUp className="h-5 w-5" />
  ) : (
    <ArrowDown className="h-5 w-5" />
  );

  return (
    <div
      className={`${bgColor} ${textColor} font-bold text-2xl px-4 py-3 rounded-lg flex items-center justify-center`}
    >
      <div className="flex flex-col items-center">
        {icon}
        <span>{action}</span>
      </div>
    </div>
  );
}
