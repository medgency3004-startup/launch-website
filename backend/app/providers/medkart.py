import requests
from typing import List

from app.models.medicine import Medicine
from app.utils.parsers import parse_price


def search(medicine: str) -> List[Medicine]:
    query = medicine.replace(" ", "+")
    url = f"https://app.medkart.in/api/v2/products/search?search={query}&page=1"

    headers = {
        "accept": "application/json",
        "user-agent": "Mozilla/5.0",
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
    except requests.RequestException as e:
        print("❌ Medkart network error:", e)
        return []

    if response.status_code != 200:
        print("❌ Medkart error:", response.status_code)
        return []

    data = response.json()
    products = data.get("data", {}).get("products", [])

    results: List[Medicine] = []

    for item in products:
        results.append(
            Medicine(
                provider="medkart",
                medicine_name=(item.get("name_web") or item.get("name") or ""),
                available=bool(item.get("can_sell_online", False)),
                mrp=parse_price(item.get("mrp")),
                price=parse_price(item.get("sales_price")),
                url=(
                    f"https://www.medkart.in/product/{item.get('slug')}"
                    if item.get("slug")
                    else None
                ),
            )
        )

    return results
