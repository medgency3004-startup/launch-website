import requests
from datetime import datetime
from typing import List

from app.models.medicine import Medicine
from app.utils.parsers import parse_discount, parse_delivery_date

NETMEDS_API = (
    "https://www.netmeds.com/api/service/application/"
    "catalog/v1.0/products/serviceability"
)

HEADERS = {
    "accept": "application/json",
    "content-type": "application/json",
    "user-agent": (
        "Mozilla/5.0 (Linux; Android 13; Pixel 7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Mobile Safari/537.36"
    ),
    "origin": "https://www.netmeds.com",
    "referer": "https://www.netmeds.com/",
    "x-currency-code": "INR",
}


def search(medicine: str, city: str) -> List[Medicine]:
    session = requests.Session()
    session.headers.update(HEADERS)

    # Netmeds REQUIRES location cookies
    session.cookies.set("pincode", "110001", domain=".netmeds.com")
    session.cookies.set("city", "Delhi", domain=".netmeds.com")

    payload = {
        "search_term": medicine,
        "page_no": 1,
        "page_size": 20,
        "pincode": "110001",  # Delhi
    }

    try:
        resp = session.post(
            NETMEDS_API,
            json=payload,
            timeout=20,
        )
    except requests.RequestException as e:
        print(f"❌ Netmeds network error: {e}")
        return []

    if resp.status_code != 200:
        print(f"❌ Netmeds HTTP {resp.status_code}")
        print(resp.text[:300])
        return []

    items = resp.json().get("items", [])
    results: List[Medicine] = []

    for item in items:
        price = item.get("price", {})
        delivery = item.get("delivery_promise", {})

        results.append(
            Medicine(
                provider="netmeds",
                sku_id=str(item.get("item_id")),
                medicine_name=item.get("slug", "")
                    .replace("-", " ")
                    .title(),
                city=city,

                available=item.get("is_serviceable", False)
                          and item.get("quantity", 0) > 0,
                rx_required=False,

                price=price.get("effective"),
                mrp=price.get("marked"),
                discount_percent=parse_discount(item.get("discount")),

                eta_minutes=None,
                delivery_date=parse_delivery_date(delivery.get("min")),

                url=f"https://www.netmeds.com/prescriptions/{item.get('slug')}",
                last_checked_at=datetime.utcnow(),
            )
        )

    return results
