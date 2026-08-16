import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import os

# SMTP Configuration (Use environment variables in production)
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "your_email@gmail.com"
SMTP_PASS = "your_app_password"

def check_and_dispatch_alerts(alerts_list, predictions_file="ml_engine/data/latest_predictions.json"):
    """
    Compares active user alerts with predicted/current lowest prices.
    Triggers email when current_price or predicted_lowest <= target_price.
    """
    if not os.path.exists(predictions_file):
        print("No prediction cache found to evaluate alerts.")
        return []

    with open(predictions_file, "r") as f:
        prediction_data = json.load(f)

    triggered_alerts = []
    current_price = prediction_data.get("current_price", float("inf"))
    predicted_low_15d = prediction_data["forecasts"][1]["predicted_low"]

    for alert in alerts_list:
        target = alert["target_price"]

        # Check if current price or 15-day predicted price meets target
        if current_price <= target or predicted_low_15d <= target:
            alert["status"] = "TRIGGERED"
            triggered_alerts.append(alert)
            print(f"[*] ALERT TRIGGERED for {alert['user_email']} on {alert['product_id']}: Target ₹{target} matched!")

            # Send email simulation
            send_alert_email(
                to_email=alert["user_email"],
                product_name="iPhone 15 Pro 128GB",
                current_price=current_price,
                predicted_low=predicted_low_15d,
                target_price=target
            )

    return triggered_alerts

def send_alert_email(to_email: str, product_name: str, current_price: float, predicted_low: float, target_price: float):
    subject = f"🔔 Price Drop Alert: {product_name} hit your target price!"
    body = f"""
    Hello,

    Good news! The product you're tracking on PriceSpy has met your target price.

    Product: {product_name}
    Target Price: ₹{target_price:,.2f}
    Current Market Price: ₹{current_price:,.2f}
    Predicted 15-Day Low: ₹{predicted_low:,.2f}

    Visit PriceSpy to view the optimal purchasing window.
    """

    print(f"--- Sending Email to {to_email} ---")
    print(f"Subject: {subject}")
    print(body.strip())
    print("-----------------------------------")

if __name__ == "__main__":
    # Test alert trigger run
    mock_alerts = [
        {"user_email": "buyer@example.com", "product_id": "prod_1", "target_price": 75000.0}
    ]
    check_and_dispatch_alerts(mock_alerts)