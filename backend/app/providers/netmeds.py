import logging
import requests
from typing import List

from app.models.medicine import Medicine
from app.providers.base import NETMEDS_HEADERS, TIMEOUT

logger = logging.getLogger(__name__)

NETMEDS_API = (
    "https://www.netmeds.com/api/service/application/"
    "catalog/v1.0/products/serviceability"
)
DEFAULT_PINCODE = "603203"
DEFAULT_CITY = "Chennai"


def search(medicine: str) -> List[Medicine]:
    session = requests.Session()
    session.headers.update(NETMEDS_HEADERS)
    session.cookies.set("pincode", DEFAULT_PINCODE, domain=".netmeds.com")
    session.cookies.set("city", DEFAULT_CITY, domain=".netmeds.com")

    payload = {
        "search_term": medicine,
        "page_no": 1,
        "page_size": 20,
        "pincode": DEFAULT_PINCODE,
    }

    try:
        resp = session.post(NETMEDS_API, json=payload, timeout=TIMEOUT)
    except requests.RequestException as e:
        logger.error("Netmeds network error: %s", e)
        return []

    if resp.status_code != 200:
        logger.warning("Netmeds HTTP %s", resp.status_code)
        return []

    items = resp.json().get("items", [])
    results: List[Medicine] = []

    for item in items:
        price_data = item.get("price", {})
        slug = item.get("slug", "")

        results.append(
            Medicine(
                provider="netmeds",
                medicine_name=slug.replace("-", " ").title(),
                available=(
                    bool(item.get("is_serviceable", False))
                    and int(item.get("quantity", 0)) > 0
                ),
                mrp=price_data.get("marked"),
                price=price_data.get("effective"),
                url=f"https://www.netmeds.com/prescriptions/{slug}" if slug else None,
            )
        )

    logger.info("Netmeds returned %d items", len(results))
    return results