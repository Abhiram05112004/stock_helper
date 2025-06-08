
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsItem {
  title: string;
  description: string;
  sentiment: number;
}

interface NewsCardProps {
  news: NewsItem[];
  loading: boolean;
}

export function NewsCard({ news, loading }: NewsCardProps) {
  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="h-6 bg-gray-200 animate-pulse rounded-md w-1/3"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Market News & Sentiment</CardTitle>
        <CardDescription>Latest updates and market sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {news.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No news articles found.</p>
            ) : (
              news.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-medium line-clamp-2 flex-1">{item.title}</h4>
                    <SentimentBadge sentiment={item.sentiment} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function SentimentBadge({ sentiment }: { sentiment: number }) {
  const getBadgeConfig = (sentiment: number) => {
    if (sentiment > 0.6) {
      return {
        label: "Positive",
        className: "bg-green-100 text-green-800 hover:bg-green-100"
      };
    } else if (sentiment < 0.4) {
      return {
        label: "Negative",
        className: "bg-red-100 text-red-800 hover:bg-red-100"
      };
    }
    return {
      label: "Neutral",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    };
  };

  const config = getBadgeConfig(sentiment);
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
