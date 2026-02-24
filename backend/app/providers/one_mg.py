import logging
import requests
from typing import List

from app.models.medicine import Medicine
from app.utils.parsers import parse_price
from app.providers.base import ONE_MG_HEADERS, TIMEOUT

logger = logging.getLogger(__name__)

BASE_URL = "https://www.1mg.com/pwa-api/api/v4/search/all"


def search(medicine: str, city: str) -> List[Medicine]:
    session = requests.Session()
    session.headers.update(ONE_MG_HEADERS)
    session.headers["x-city"] = city
    session.cookies.update({"city": city})

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
        resp = session.get(BASE_URL, params=params, timeout=TIMEOUT)
    except requests.RequestException as e:
        logger.error("1mg network error: %s", e)
        return []

    if resp.status_code != 200:
        logger.warning("1mg HTTP %s", resp.status_code)
        return []

    data = resp.json().get("data", {}).get("search_results", [])
    if not data:
        logger.info("1mg returned no results")
        return []

    results: List[Medicine] = []

    for item in data:
        prices = item.get("prices", {})
        url = item.get("url")

        results.append(
            Medicine(
                provider="tata_1mg",
                medicine_name=item.get("name", ""),
                available=bool(item.get("available")),
                price=parse_price(prices.get("discounted_price")),
                mrp=parse_price(prices.get("mrp")),
                url=f"https://www.1mg.com{url}" if url else None,
            )
        )

    logger.info("1mg returned %d items", len(results))
    return results