import logging
import requests
from typing import List

from app.models.medicine import Medicine
from app.utils.parsers import parse_price
from app.providers.base import BROWSER_HEADERS, TIMEOUT

logger = logging.getLogger(__name__)

MEDKART_SEARCH_API = "https://app.medkart.in/api/v2/products/search"


def search(medicine: str) -> List[Medicine]:
    params = {"search": medicine.replace(" ", "+"), "page": 1}

    try:
        resp = requests.get(
            MEDKART_SEARCH_API,
            params=params,
            headers=BROWSER_HEADERS,
            timeout=TIMEOUT,
        )
    except requests.RequestException as e:
        logger.error("Medkart network error: %s", e)
        return []

    if resp.status_code != 200:
        logger.warning("Medkart HTTP %s", resp.status_code)
        return []

    products = resp.json().get("data", {}).get("products", [])
    results: List[Medicine] = []

    for item in products:
        slug = item.get("slug")
        results.append(
            Medicine(
                provider="medkart",
                medicine_name=item.get("name_web") or item.get("name") or "",
                available=bool(item.get("can_sell_online", False)),
                mrp=parse_price(item.get("mrp")),
                price=parse_price(item.get("sales_price")),
                url=f"https://www.medkart.in/product/{slug}" if slug else None,
            )
        )

    logger.info("Medkart returned %d items", len(results))
    return results