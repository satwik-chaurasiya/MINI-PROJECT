import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_mock_price_series(product_id="prod_1", base_price=85000, days=365):
    os.makedirs("ml_engine/data", exist_ok=True)

    start_date = datetime.now() - timedelta(days=days)
    dates = [start_date + timedelta(days=i) for i in range(days)]

    # Generate gradual downward trend + seasonal fluctuations + noise
    trend = np.linspace(base_price, base_price * 0.92, days)
    seasonality = 1500 * np.sin(np.linspace(0, 8 * np.pi, days))
    noise = np.random.normal(0, 500, days)
    prices = trend + seasonality + noise

    # Simulate major sale event price drops (e.g., Festival / Prime Day shocks)
    for i in range(len(prices)):
        if i % 60 in [0, 1, 2]:  # Periodic discount windows
            prices[i] -= 5000 + np.random.uniform(500, 1500)

    df = pd.DataFrame({
        "product_id": product_id,
        "date": [d.strftime("%Y-%m-%d") for d in dates],
        "price": np.round(prices, 2)
    })

    output_path = f"ml_engine/data/{product_id}_history.csv"
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} price history records at: {output_path}")
    return df

if __name__ == "__main__":
    generate_mock_price_series()