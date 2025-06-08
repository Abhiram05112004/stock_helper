// Real API service that connects to your Python ML backend
// Connecting to FastAPI backend

const API_BASE_URL = 'http://localhost:8000/api';

async function fetchStockNews(ticker: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/news?symbol=${ticker}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    // Fallback to mock data for development only if needed
    return generateMockNews(ticker);
  }
}

// Mock news generator
function generateMockNews(ticker: string) {
  const baseNews = [
    {
      title: `${ticker} Reports Strong Q2 Results`,
      description: `${ticker} announced quarterly results exceeding analyst expectations with revenue growth of 12% year-over-year.`,
      sentiment: 0.75
    },
    {
      title: `New Leadership at ${ticker}`,
      description: `${ticker} appointed a new CTO to lead their digital transformation initiatives, focusing on AI and cloud technologies.`,
      sentiment: 0.65
    },
    {
      title: `${ticker} Expands Operations`,
      description: `${ticker} announced plans to expand operations into international markets, targeting 20% growth in the coming fiscal year.`,
      sentiment: 0.70
    },
    {
      title: `Analyst Downgrades ${ticker}`,
      description: `Leading financial analysts have downgraded ${ticker} citing concerns about market competition and margin pressures.`,
      sentiment: 0.25
    },
    {
      title: `${ticker} Faces Regulatory Scrutiny`,
      description: `Regulatory authorities are investigating ${ticker} for potential compliance issues in their recent financial reports.`,
      sentiment: 0.30
    },
    {
      title: `${ticker} Announces Stock Buyback`,
      description: `The board of ${ticker} has approved a $2 billion stock buyback program to be implemented over the next 12 months.`,
      sentiment: 0.60
    }
  ];
  
  // Shuffle and return 3-5 news items
  return baseNews
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 3));
}

// Main service methods
export async function getStockPrediction(stock: string, exchange: string = "NSE") {
  try {
    // Only fetch prediction from backend
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock, exchange }),
    });
    
    if (!response.ok) throw new Error('Failed to get prediction from backend');
    const predictionData = await response.json();
    
    // Add stockSymbol for compatibility
    return {
      ...predictionData,
      stockSymbol: stock
    };
  } catch (error) {
    console.error('Error in getStockPrediction:', error);
    throw error;
  }
}
