from fastapi import APIRouter, Query, HTTPException
from app.models.ml_model import IndianStockPredictor

router = APIRouter()

@router.post("/technical-indicators")
def calc_indicators(symbol: str = Query(...)):
    try:
        predictor = IndianStockPredictor(symbol)
        data = predictor._fetch_stock_data()
        if data is None:
            raise HTTPException(status_code=404, detail="Data not found.")
        enriched = predictor._add_technical_indicators(data)
        return enriched.reset_index().to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
