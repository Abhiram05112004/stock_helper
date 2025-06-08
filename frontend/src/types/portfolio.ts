
export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  dateAdded: string;
}

export interface PortfolioState {
  items: PortfolioItem[];
  addItem: (item: Omit<PortfolioItem, 'id' | 'dateAdded'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<PortfolioItem>) => void;
}
