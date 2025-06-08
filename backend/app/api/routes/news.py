from fastapi import APIRouter, Query, HTTPException
from app.models.ml_model import IndianStockPredictor
from app.core.config import settings

router = APIRouter()

@router.get("/news")
def fetch_news(symbol: str = Query(...), num_articles: int = 5):
    try:
        predictor = IndianStockPredictor(symbol)
        api_key = settings.perplexity_api_key
        news = predictor.fetch_news(symbol, api_key, num_articles)
        return news
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

