import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error

def evaluate_model_performance(data_path="ml_engine/data/prod_1_history.csv", test_days=30):
    df = pd.read_csv(data_path)
    df['ds'] = pd.to_datetime(df['date'])
    df['y'] = df['price']
    df = df.sort_values('ds').reset_index(drop=True)

    # Chronological split: 80% train, last 30 days test
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

    print("=== Model Evaluation Report ===")
    print(f"Mean Absolute Error (MAE):     ₹{mae:.2f}")
    print(f"Root Mean Squared Error (RMSE): ₹{rmse:.2f}")
    print(f"Mean Abs Percentage Error (MAPE): {mape:.2f}%")
    print(f"Overall Forecast Accuracy:     {accuracy:.2f}% (Target: >= 82%)")

    return {"mae": mae, "rmse": rmse, "mape": mape, "accuracy": accuracy}

if __name__ == "__main__":
    evaluate_model_performance()