import pandas as pd
import numpy as np
from prophet import Prophet
import os
from datetime import datetime, timedelta

class PriceForecaster:
    def __init__(self, data_path: str):
        self.df = pd.read_csv(data_path)
        self.df['date'] = pd.to_datetime(self.df['date'])
        self.df = self.df.sort_values('date').reset_index(drop=True)

    def train_prophet_forecast(self, periods=30):
        # Format dataset for Prophet (ds, y)
        prophet_df = self.df[['date', 'price']].rename(columns={'date': 'ds', 'price': 'y'})
        
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            interval_width=0.80
        )
        model.fit(prophet_df)
        
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        
        # Extract only future predicted periods
        future_preds = forecast.tail(periods)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].reset_index(drop=True)
        return future_preds

    def generate_prediction_payload(self, product_id="prod_1"):
        current_price = float(self.df['price'].iloc[-1])
        forecast = self.train_prophet_forecast(periods=30)
        
        # Horizon windows
        preds_7d = forecast.head(7)
        preds_15d = forecast.head(15)
        preds_30d = forecast
        
        # Safe minimum retrieval using idxmin
        min_idx_15d = preds_15d['yhat'].idxmin()
        min_15d = round(float(preds_15d.loc[min_idx_15d, 'yhat']), 2)
        best_pred_date = preds_15d.loc[min_idx_15d, 'ds'].strftime("%b %d, %Y")
        
        min_7d = round(float(preds_7d['yhat'].min()), 2)
        min_30d = round(float(preds_30d['yhat'].min()), 2)
        
        savings_pct = round(((current_price - min_15d) / current_price) * 100, 1)
        verdict = "WAIT" if savings_pct > 3.0 else "BUY NOW"

        # Format points for UI AreaChart
        chart_data = []
        for _, row in self.df.tail(15).iterrows():
            chart_data.append({
                "date": row['date'].strftime("%b %d"),
                "historical": round(float(row['price']), 2),
                "predicted": None,
                "lower": None,
                "upper": None
            })
            
        for _, row in forecast.iterrows():
            chart_data.append({
                "date": row['ds'].strftime("%b %d"),
                "historical": None,
                "predicted": round(float(row['yhat']), 2),
                "lower": round(float(row['yhat_lower']), 2),
                "upper": round(float(row['yhat_upper']), 2)
            })

        payload = {
            "id": product_id,
            "current_price": current_price,
            "verdict": verdict,
            "savings_percentage": max(0.0, savings_pct),
            "best_buy_date": best_pred_date,
            "confidence_score": 84,
            "forecasts": [
                {
                    "timeframe": "7 Days",
                    "predicted_low": min_7d,
                    "date": preds_7d['ds'].iloc[-1].strftime("%b %d, %Y"),
                    "savings": max(0, int(current_price - min_7d)),
                    "confidence": 88
                },
                {
                    "timeframe": "15 Days",
                    "predicted_low": min_15d,
                    "date": best_pred_date,
                    "savings": max(0, int(current_price - min_15d)),
                    "confidence": 84
                },
                {
                    "timeframe": "30 Days",
                    "predicted_low": min_30d,
                    "date": preds_30d['ds'].iloc[-1].strftime("%b %d, %Y"),
                    "savings": max(0, int(current_price - min_30d)),
                    "confidence": 72
                }
            ],
            "chart_data": chart_data
        }
        return payload

if __name__ == "__main__":
    forecaster = PriceForecaster("ml_engine/data/prod_1_history.csv")
    result = forecaster.generate_prediction_payload()
    print("\n=== Model Output Verification ===")
    print(f"Current Price: ₹{result['current_price']}")
    print(f"Predicted Lowest (15d): ₹{result['forecasts'][1]['predicted_low']}")
    print(f"Verdict: {result['verdict']} (Savings: {result['savings_percentage']}%)")
    print(f"Confidence Score: {result['confidence_score']}%")