import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicators {
  sma20: Array<{ value: number }>;
  bollingerBands: Array<{
    BB_upper: number;
    BB_middle: number;
    BB_lower: number;
  }>;
}

interface StockResponse {
  symbol: string;
  exchange: string;
  historical_data: HistoricalData[];
  technical_indicators: TechnicalIndicators;
}

export const getStockPrediction = async (stockSymbol: string, exchange: string) => {
  try {
    // First get historical data
    const historicalResponse = await axios.get<StockResponse>(
      `${API_BASE_URL}/api/historical/${stockSymbol}?exchange=${exchange}`
    );
    
    if (!historicalResponse.data || !historicalResponse.data.historical_data) {
      throw new Error('No historical data received from the server');
    }

    // Then get prediction data
    const predictionResponse = await axios.get(
      `${API_BASE_URL}/api/predict/${stockSymbol}?exchange=${exchange}`
    );

    // Combine the data
    return {
      ...predictionResponse.data,
      historicalData: historicalResponse.data.historical_data,
      technicalIndicators: historicalResponse.data.technical_indicators,
      stockSymbol: stockSymbol,
      exchange: exchange
    };
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.detail || 'Failed to fetch stock data');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}; 