import requests
from bs4 import BeautifulSoup
import random
import datetime

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
]

def scrape_product_price(url: str, platform: str = "Amazon"):
    """
    Extracts live listing price from supported platforms with header rotation.
    """
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            print(f"Failed to fetch {url}, status code: {response.status_code}")
            return None

        soup = BeautifulSoup(response.content, "html.parser")

        # Platform-specific selector parsing
        if "amazon" in platform.lower():
            price_elem = soup.find("span", {"class": "a-price-whole"})
            if price_elem:
                raw_price = price_elem.get_text().replace(",", "").replace(".", "").strip()
                return float(raw_price)

        elif "flipkart" in platform.lower():
            price_elem = soup.find("div", {"class": "_30jeq3"})
            if price_elem:
                raw_price = price_elem.get_text().replace("₹", "").replace(",", "").strip()
                return float(raw_price)

    except Exception as e:
        print(f"Scraping error on {platform}: {e}")

    return None

if __name__ == "__main__":
    # Demonstration URL check
    test_url = "https://www.amazon.in/dp/B0CHX1W1XY"
    print(f"[{datetime.datetime.now()}] Testing live scraper module...")
    price = scrape_product_price(test_url, "Amazon")
    print(f"Extracted Price: {price if price else 'Fallback to historical database'}")