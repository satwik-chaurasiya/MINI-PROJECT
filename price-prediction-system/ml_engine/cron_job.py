import json
import os
from datetime import datetime
from models.forecaster import PriceForecaster

def run_daily_prediction_batch():
    print(f"[{datetime.now()}] --- Running Scheduled Price Prediction Batch ---")
    data_file = "ml_engine/data/prod_1_history.csv"
    
    if not os.path.exists(data_file):
        print(f"Error: Missing {data_file}. Generating fresh dataset...")
        from preprocessing.generate_data import generate_mock_price_series
        generate_mock_price_series()

    forecaster = PriceForecaster(data_file)
    predictions = forecaster.generate_prediction_payload(product_id="prod_1")
    
    output_cache = "ml_engine/data/latest_predictions.json"
    with open(output_cache, "w") as f:
        json.dump(predictions, f, indent=2)

    print(f"Successfully generated forecasts and saved to {output_cache}")

if __name__ == "__main__":
    run_daily_prediction_batch()