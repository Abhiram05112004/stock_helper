from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.ml_model import IndianStockPredictor

router = APIRouter()

class PredictRequest(BaseModel):
    stock: str
    exchange: str = "NSE"  # Default to NSE

@router.post("/predict")
def predict(request: PredictRequest):
    try:
        predictor = IndianStockPredictor(request.stock, request.exchange)
        result = predictor.predict_stock()
        
        # Format the response to match frontend expectations
        formatted_response = {
            "stockSymbol": request.stock,
            "prediction": {
                "action": result.get("action", ""),
                "timing": result.get("timing_recommendation", ""),
                "confidence": result.get("confidence", 0),
                "predictedReturn": result.get("predicted_return", 0),
                "currentPrice": result.get("current_price", 0),
                "predictedPrice": result.get("predicted_price", 0),
                "volatility": result.get("volatility", 0),
                "marketSentiment": result.get("market_sentiment", "Neutral"),
                "modelAccuracy": {
                    "train": result.get("price_model_train_accuracy", 0),
                    "test": result.get("price_model_test_accuracy", 0)
                }
            },
            "historicalData": predictor._fetch_stock_data().reset_index().to_dict(orient="records") if predictor._fetch_stock_data() is not None else [],
            "technicalIndicators": predictor._add_technical_indicators(predictor._fetch_stock_data()).reset_index().to_dict(orient="records") if predictor._fetch_stock_data() is not None else []
        }
        
        return formatted_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
