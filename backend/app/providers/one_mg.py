import requests
import time
from datetime import datetime
from typing import List

from app.models.medicine import MedicineAvailability
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


def search(medicine: str, city: str) -> List[MedicineAvailability]:
    session = requests.Session()
    session.headers.update(HEADERS)
    session.headers["x-city"] = city
    session.cookies.update({"city": city})

    results: List[MedicineAvailability] = []
    seen_skus = set()
    page = 0

    MAX_PAGES = 3  # DEBUG SAFETY (increase later)

    while page < MAX_PAGES:
        print(f"📡 1mg | {city} | page {page}")

        params = {
            "q": medicine,
            "city": city,
            "page_number": page,
            "per_page": 20,
            "types": "sku,allopathy",
            "sort": "relevance",
            "fetch_eta": "true",
            "is_city_serviceable": "true",
        }

        try:
            r = session.get(BASE_URL, params=params, timeout=20)
        except requests.RequestException as e:
            print(f"❌ Network error: {e}")
            break

        if r.status_code != 200:
            print(f"❌ HTTP {r.status_code}")
            break

        data = r.json().get("data", {}).get("search_results", [])
        if not data:
            print("🛑 No data returned")
            break

        new_items = 0

        for item in data:
            sku = str(item.get("id"))
            if sku in seen_skus:
                continue

            seen_skus.add(sku)
            new_items += 1

            prices = item.get("prices", {})

            results.append(
                MedicineAvailability(
                    provider="tata_1mg",
                    sku_id=sku,
                    medicine_name=item.get("name"),
                    city=city,

                    available=item.get("available"),
                    rx_required=item.get("rx_required"),

                    price=parse_price(prices.get("discounted_price")),
                    mrp=parse_price(prices.get("mrp")),
                    discount_percent=parse_discount(prices.get("discount")),

                    eta_minutes=parse_eta(item.get("eta")),
                    delivery_date=None,

                    url="https://www.1mg.com" + item.get("url", ""),
                    last_checked_at=datetime.utcnow(),
                )
            )

        print(f"✅ Added {new_items} new items")

        if new_items == 0:
            print("🛑 No new SKUs, stopping pagination")
            break

        page += 1
        time.sleep(REQUEST_DELAY)

    return results
