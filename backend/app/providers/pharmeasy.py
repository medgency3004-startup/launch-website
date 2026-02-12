import json
from typing import List
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from app.models.medicine import Medicine
from rich import print

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

REQUEST_TIMEOUT_SECONDS = 4
MAX_WORKERS = 16


def _parse_medicine_from_page(page_url: str) -> Medicine:
    resp = requests.get(page_url, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS)

    dummny_val = Medicine(
        provider="pharmeasy",
        medicine_name="",
        available=False,
        mrp=None,
        price=None,
        url=page_url,
    )

    if resp.status_code != 200:
        return dummny_val

    soup = BeautifulSoup(resp.text, "html.parser")
    json_matches = soup.find_all(name="script", attrs={"type": "application/ld+json"})

    # PharmEasy pages can change layout; be defensive about JSON-LD structure.
    data = None
    for script in json_matches:
        # Prefer the first JSON-LD block that parses and looks like a product.
        raw = None
        if script.string:
            raw = script.string
        elif script.contents:
            raw = script.contents[0]

        if not raw:
            continue

        try:
            prodcut_json = json.loads(str(raw))
        except Exception:
            continue

        # JSON-LD may be a list or a single dict
        if isinstance(prodcut_json, list):
            product_obj = None
            for item in prodcut_json:
                if isinstance(item, dict) and (
                    item.get("name") or item.get("@type") == "Product"
                ):
                    product_obj = item
                    break
            if not product_obj:
                continue
            prodcut_json = product_obj

        if not isinstance(prodcut_json, dict):
            continue

        # Require at least a name or offers to consider this valid
        if prodcut_json.get("name") or prodcut_json.get("offers"):
            data = prodcut_json
            break

    if not data:
        # Could not find a usable JSON-LD script; treat as unavailable.
        return Medicine(
            provider="pharmeasy",
            medicine_name="",
            available=False,
            mrp=None,
            price=None,
            url=page_url,
        )

    offers = data.get("offers") or {}
    # offers can sometimes be a list in JSON-LD
    if isinstance(offers, list):
        offers = offers[0] if offers else {}
    if not isinstance(offers, dict):
        offers = {}

    availability = offers.get("availability", "") if isinstance(offers, dict) else ""
    is_available = True if "InStock" in availability else False

    return Medicine(
        provider="pharmeasy",
        medicine_name=data.get("name") or "",
        available=is_available,
        price=offers.get("price"),
        url=data.get("url") or page_url,
        mrp=offers.get("price"),
    )


def search(medicine: str):
    search_results = f"https://pharmeasy.in/search/all?name={medicine}"
    resp = requests.get(
        search_results, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS
    )
    results: List[Medicine] = []

    if resp.status_code != 200:
        print(f"❌ Pharmeasy HTTP {resp.status_code}")
        print(resp.text[:300])
        return []

    raw_html = resp.text

    soup = BeautifulSoup(raw_html, "html.parser")
    products = soup.find_all(
        name="a",
        class_="ProductCard_medicineUnitWrapper__rgDfO ProductCard_defaultWrapper__h4yf3",
        # TODO: make this more automatic
    )

    product_page_urls = [
        f"https://pharmeasy.in{product_raw.get('href')}" for product_raw in products
    ]

    if not product_page_urls:
        return []

    max_workers = min(len(product_page_urls), MAX_WORKERS)

    with ThreadPoolExecutor(max_workers=max_workers) as executer:
        futures = [
            executer.submit(_parse_medicine_from_page, page_url)
            for page_url in product_page_urls
        ]

        for future in as_completed(futures):
            result = future.result()
            results.append(result)

    print(results)
    print(f"Pharmeasy gave {len(results)} items")
    return results
