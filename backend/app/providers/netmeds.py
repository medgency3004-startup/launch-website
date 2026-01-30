import requests
from datetime import datetime
from typing import List

from app.models.medicine import MedicineAvailability
from app.utils.parsers import parse_discount, parse_delivery_date

NETMEDS_API = (
    "https://www.netmeds.com/api/service/application/"
    "catalog/v1.0/products/serviceability"
)

HEADERS = {
    "accept": "application/json",
    "content-type": "application/json",
    "user-agent": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/18.5 Mobile/15E148 Safari/604.1"
    ),
    "x-currency-code": "INR",
}

def search(medicine: str, city: str) -> List[MedicineAvailability]:
    """
    Netmeds provider (API-based, scheduled delivery)
    """

    payload = {
        "search_term": medicine,
        "page_no": 1,
        "page_size": 20,
        "pincode": "110001",   # Delhi for now (we'll generalize later)
    }

    resp = requests.post(
        NETMEDS_API,
        json=payload,
        headers=HEADERS,
        timeout=20,
    )

    if resp.status_code != 200:
        print(f"❌ Netmeds HTTP {resp.status_code}")
        return []

    items = resp.json().get("items", [])
    results: List[MedicineAvailability] = []

    for item in items:
        price = item.get("price", {})
        delivery = item.get("delivery_promise", {})

        results.append(
            MedicineAvailability(
                provider="netmeds",
                sku_id=str(item.get("item_id")),
                medicine_name=item.get("slug", "").replace("-", " ").title(),
                city=city,

                available=item.get("is_serviceable", False)
                          and item.get("quantity", 0) > 0,
                rx_required=False,  # Netmeds does not flag Rx cleanly

                price=price.get("effective"),
                mrp=price.get("marked"),
                discount_percent=parse_discount(item.get("discount")),

                eta_minutes=None,  # IMPORTANT: Netmeds has no minute ETA
                delivery_date=parse_delivery_date(delivery.get("min")),

                url=f"https://www.netmeds.com/prescriptions/{item.get('slug')}",
                last_checked_at=datetime.utcnow(),
            )
        )

    return results
