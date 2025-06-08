
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PredictionCardProps {
  title: string;
  value: string;
  description?: string;
  progress?: number;
  progressColor?: string;
  icon?: React.ReactNode;
  loading: boolean;
}

export function PredictionCard({
  title,
  value,
  description,
  progress,
  progressColor = "#3b82f6",
  icon,
  loading,
}: PredictionCardProps) {
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

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
          {typeof progress === "number" && (
            <Progress
              className="h-2 mt-2"
              value={progress}
              color={progressColor}
              style={
                progressColor
                  ? { "--progress-color": progressColor } as React.CSSProperties
                  : undefined
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
