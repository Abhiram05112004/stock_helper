
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ConfidenceScoreProps {
  confidence: number;
  loading: boolean;
}

export function ConfidenceScore({ confidence, loading }: ConfidenceScoreProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 animate-pulse rounded-md w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
        </CardContent>
      </Card>
    );
  }

  // Determine color based on confidence level
  let confidenceColor = "#ef4444"; // Red for low confidence
  if (confidence >= 80) {
    confidenceColor = "#22c55e"; // Green for high confidence
  } else if (confidence >= 60) {
    confidenceColor = "#f59e0b"; // Amber for medium confidence
  }

  // Determine confidence level text
  let confidenceLevel = "Low";
  if (confidence >= 80) {
    confidenceLevel = "High";
  } else if (confidence >= 60) {
    confidenceLevel = "Medium";
  }

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Prediction Confidence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tight">{confidence.toFixed(1)}%</div>
            <CardDescription className="text-sm font-medium" style={{ color: confidenceColor }}>
              {confidenceLevel}
            </CardDescription>
          </div>
          <Progress
            className="h-2 mt-2"
            value={confidence}
            color={confidenceColor}
            style={{ "--progress-color": confidenceColor } as React.CSSProperties}
          />
          <CardDescription className="text-sm mt-2">
            The model's confidence in this prediction based on historical data analysis and market patterns.
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
