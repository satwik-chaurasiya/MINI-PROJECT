import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # allow ₹ on Windows cp1252 consoles
import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error

ML_ENGINE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(ML_ENGINE_DIR)
for p in [PROJECT_ROOT, ML_ENGINE_DIR]:
    if p not in sys.path:
        sys.path.append(p)

DEFAULT_DATA_PATH = os.path.join(ML_ENGINE_DIR, "data", "prod_1_history.csv")

def evaluate_model_performance(data_path=DEFAULT_DATA_PATH, test_days=None):
    data_dir = os.path.join(ML_ENGINE_DIR, "data")
    if not os.path.exists(data_path):
        csv_files = [os.path.join(data_dir, f) for f in os.listdir(data_dir) if f.endswith("_history.csv")] if os.path.exists(data_dir) else []
        if csv_files:
            data_path = csv_files[0]
            print(f"Default dataset not found, using existing dataset: {os.path.basename(data_path)}")
        else:
            print(f"Data file not found. Generating fresh dataset at {data_path}...")
            from preprocessing.generate_data import generate_mock_price_series
            generate_mock_price_series(product_id="prod_1", base_price=85000, days=365)

    df = pd.read_csv(data_path)
    df['ds'] = pd.to_datetime(df['date'])
    df['y'] = df['price']
    df = df.sort_values('ds').reset_index(drop=True)

    # Chronological 80/20 train/test split
    if test_days is None:
        test_days = max(14, int(len(df) * 0.20))

    train_df = df.iloc[:-test_days]
    test_df = df.iloc[-test_days:].reset_index(drop=True)

    model = Prophet(
        daily_seasonality=False,
        weekly_seasonality=True,
        yearly_seasonality=True,
        interval_width=0.80
    )
    model.fit(train_df[['ds', 'y']])

    future = model.make_future_dataframe(periods=test_days)
    forecast = model.predict(future)
    predictions = forecast.tail(test_days)['yhat'].values

    # Compute evaluation metrics
    actuals = test_df['y'].values
    mae = mean_absolute_error(actuals, predictions)
    rmse = np.sqrt(mean_squared_error(actuals, predictions))
    mape = np.mean(np.abs((actuals - predictions) / actuals)) * 100
    accuracy = 100 - mape

    print(f"=== Model Evaluation Report ({len(train_df)} train / {test_days} test days — 80/20 split) ===")
    print(f"Mean Absolute Error (MAE):     ₹{mae:.2f}")
    print(f"Root Mean Squared Error (RMSE): ₹{rmse:.2f}")
    print(f"Mean Abs Percentage Error (MAPE): {mape:.2f}%")
    print(f"Overall Forecast Accuracy:     {accuracy:.2f}% (Target: >= 82%)")

    return {"mae": mae, "rmse": rmse, "mape": mape, "accuracy": accuracy}

if __name__ == "__main__":
    evaluate_model_performance()