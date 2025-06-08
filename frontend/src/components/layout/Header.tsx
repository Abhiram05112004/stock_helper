import React from "react";
import { TrendingUp, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/SearchForm";

interface HeaderProps {
  onSearch: (stockSymbol: string, exchange: string) => Promise<void>;
  onTogglePortfolio: () => void;
  isLoading: boolean;
}

export function Header({ onSearch, onTogglePortfolio, isLoading }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Stock Whisper</h1>
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={onTogglePortfolio}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Portfolio
            </Button>
          </div>
          <div>
            <SearchForm
              onSubmit={onSearch}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
