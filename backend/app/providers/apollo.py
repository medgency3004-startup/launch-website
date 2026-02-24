import logging
import requests
from typing import List

from app.models.medicine import Medicine
from app.utils.parsers import parse_price
from app.providers.base import APOLLO_HEADERS, TIMEOUT

logger = logging.getLogger(__name__)

APOLLO_SEARCH_API = "https://search.apollo247.com/v4/fullSearch"
DEFAULT_PINCODE = "603203"


def search(medicine: str, pincode: str = DEFAULT_PINCODE) -> List[Medicine]:
    payload = {
        "query": medicine,
        "page": 1,
        "productsPerPage": 24,
        "selSortBy": "relevance",
        "filters": [],
        "pincode": pincode,
    }

    try:
        resp = requests.post(
            APOLLO_SEARCH_API,
            json=payload,
            headers=APOLLO_HEADERS,
            timeout=TIMEOUT,
        )
    except requests.RequestException as e:
        logger.error("Apollo network error: %s", e)
        return []

    if resp.status_code != 200:
        logger.warning("Apollo HTTP %s", resp.status_code)
        return []

    products = (
        resp.json()
        .get("data", {})
        .get("productDetails", {})
        .get("products", [])
    )

    results: List[Medicine] = []
    for item in products:
        if not isinstance(item, dict):
            continue
        sub_category = (item.get("subCategory") or "").strip().lower()
        url_key = item.get("urlKey")
        path_prefix = "otc" if sub_category == "otc" else "medicine"
        results.append(
            Medicine(
                provider="apollo",
                medicine_name=item.get("name", ""),
                available=item.get("status") == "in-stock",
                mrp=parse_price(item.get("price")),
                price=parse_price(item.get("specialPrice")),
                url=f"https://www.apollopharmacy.in/{path_prefix}/{url_key}" if url_key else None,
            )
        )

    logger.info("Apollo returned %d items", len(results))
    return results