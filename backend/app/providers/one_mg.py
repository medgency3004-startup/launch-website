import requests
import time
from datetime import datetime
from typing import List
import json

from app.models.medicine import Medicine
from app.utils.parsers import parse_price, parse_discount, parse_eta
from app.config import REQUEST_DELAY

BASE_URL = "https://www.1mg.com/pwa-api/api/v4/search/all"

HEADERS = {
    "accept": "application/vnd.healthkartplus.v4+json",
    "user-agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "x-platform": "mobileweb-0.0.1",
    "x-1mglabs-platform": "mWeb",
    "referer": "https://www.1mg.com/",
}


def search(medicine: str, city: str) -> List[Medicine]:
    session = requests.Session()
    session.headers.update(HEADERS)
    session.headers["x-city"] = city
    session.cookies.update({"city": city})

    results: List[Medicine] = []
    params = {
        "q": medicine,
        "city": city,
        "page_number": 0,
        "per_page": 5,
        "types": "sku,allopathy",
        "sort": "relevance",
        "fetch_eta": "true",
        "is_city_serviceable": "true",
    }


    try:
        r = session.get(BASE_URL, params=params, timeout=20)
    except requests.RequestException as e:
        print(f"❌ Network error: {e}")
        return []
        
    if r.status_code != 200:
        print(f"❌ HTTP {r.status_code}")
        return []

    data = r.json().get("data", {}).get("search_results", [])
    if not data:
        print("🛑 No data returned")
        return []

    for item in data:
        prices = item.get("prices", {})

        results.append(
            Medicine(
                provider="tata_1mg",
                medicine_name=item.get("name"),
                available=item.get("available"),
                price=parse_price(prices.get("discounted_price")),
                mrp=parse_price(prices.get("mrp")),
                url=(
                    "https://www.1mg.com" + item.get("url")
                    if item.get("url")
                    else None
                ),
            )
        )
    print(f"Tata 1mg gave {len(data)} items")

    return results
