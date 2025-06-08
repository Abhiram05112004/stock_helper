import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFormProps {
  onSubmit: (stockSymbol: string, exchange: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [stockSymbol, setStockSymbol] = useState("");
  const [exchange, setExchange] = useState("NSE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockSymbol.trim()) {
      onSubmit(stockSymbol.trim().toUpperCase(), exchange);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter stock symbol (e.g., INFY)"
        value={stockSymbol}
        onChange={(e) => setStockSymbol(e.target.value)}
        className="flex-1"
      />
      <Select value={exchange} onValueChange={setExchange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Exchange" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NSE">NSE</SelectItem>
          <SelectItem value="BSE">BSE</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!stockSymbol.trim() || isLoading}>
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" /> Search
          </>
        )}
      </Button>
    </form>
  );
}
