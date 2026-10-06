import json
import os
from datetime import datetime
from models.forecaster import PriceForecaster

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

def run_daily_prediction_batch():
    print(f"[{datetime.now()}] --- Running Scheduled Price Prediction Batch ---")
    data_file = os.path.join(DATA_DIR, "prod_1_history.csv")
    
    if not os.path.exists(data_file):
        print(f"Error: Missing {data_file}. Generating fresh dataset...")
        from preprocessing.generate_data import generate_mock_price_series
        generate_mock_price_series()

    forecaster = PriceForecaster(data_file)
    predictions = forecaster.generate_prediction_payload(product_id="prod_1")
    
    output_cache = os.path.join(DATA_DIR, "latest_predictions.json")
    with open(output_cache, "w") as f:
        json.dump(predictions, f, indent=2)

    print(f"Successfully generated forecasts and saved to {output_cache}")

if __name__ == "__main__":
    run_daily_prediction_batch()