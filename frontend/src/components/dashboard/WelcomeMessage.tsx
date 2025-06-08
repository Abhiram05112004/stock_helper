
import React from "react";
import { TrendingUp } from "lucide-react";

export function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <TrendingUp className="h-16 w-16 text-primary/20 mb-4" />
      <h2 className="text-2xl font-medium text-gray-700 mb-2">
        Welcome to Stock Whisper
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        Enter an Indian stock symbol (e.g., INFY, RELIANCE, TCS) to get AI-powered
        predictions and analysis.
      </p>
    </div>
  );
}
