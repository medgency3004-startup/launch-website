import requests
from typing import List

from app.models.medicine import Medicine
from app.utils.parsers import parse_price

APOLLO_SEARCH_API = "https://search.apollo247.com/v4/fullSearch"

HEADERS = {
    "accept": "application/json",
    "content-type": "application/json",
    "origin": "https://www.apollopharmacy.in",
    "referer": "https://www.apollopharmacy.in/",
    "user-agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "x-app-os": "web",
    "authorization": "Oeu324WMvfKOj5KMJh2Lkf00eW1",
}


def search(medicine: str) -> List[Medicine]:
    payload = {
        "query": medicine,
        "page": 1,
        "productsPerPage": 24,
        "selSortBy": "relevance",
        "filters": [],
        "pincode": ""
    }

    resp = requests.post(
        APOLLO_SEARCH_API,
        json=payload,
        headers=HEADERS,
        timeout=20,
    )

    if resp.status_code != 200:
        print(f"❌ Apollo HTTP {resp.status_code}")
        print(resp.text[:300])
        return []

    data = resp.json()

    # ✅ CORRECT PATH
    products = (
        data
        .get("data", {})
        .get("productDetails", {})
        .get("products", [])
    )

    results: List[Medicine] = []

    for item in products:
        if not isinstance(item, dict):
            continue

        results.append(
            Medicine(
                provider="apollo",
                medicine_name=item.get("name"),
                available=item.get("status") == "in-stock",
                mrp=parse_price(item.get("price")),
                price=parse_price(item.get("specialPrice")),
                url="https://www.apollopharmacy.in/"
                    + item.get("urlKey", ""),
            )
        )

    print(f"Apollo gave {len(results)} items")
    return results
