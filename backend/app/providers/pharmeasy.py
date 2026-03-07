import json
import logging
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List

from bs4 import BeautifulSoup
from app.models.medicine import Medicine
from app.providers.base import PHARMEASY_HEADERS, TIMEOUT

logger = logging.getLogger(__name__)

MAX_RESULTS = 5
MAX_WORKERS = MAX_RESULTS


def _parse_product_page(page_url: str) -> Medicine:
    """Scrapes a single PharmEasy product page for price and availability."""
    fallback = Medicine(
        provider="pharmeasy",
        medicine_name="",
        available=False,
        mrp=None,
        price=None,
        url=page_url,
    )

    try:
        resp = requests.get(page_url, headers=PHARMEASY_HEADERS, timeout=TIMEOUT)
    except requests.RequestException as e:
        logger.warning("PharmEasy page fetch failed (%s): %s", page_url, e)
        return fallback

    if resp.status_code != 200:
        return fallback

    soup = BeautifulSoup(resp.text, "html.parser")
    scripts = soup.find_all("script", attrs={"type": "application/ld+json"})

    product_data = None
    for script in scripts:
        raw = script.string or (script.contents[0] if script.contents else None)
        if not raw:
            continue

        try:
            parsed = json.loads(str(raw))
        except (json.JSONDecodeError, ValueError):
            continue

        # JSON-LD may be a list or a single dict
        if isinstance(parsed, list):
            parsed = next(
                (
                    item
                    for item in parsed
                    if isinstance(item, dict)
                    and (item.get("name") or item.get("@type") == "Product")
                ),
                None,
            )

        if not isinstance(parsed, dict):
            continue

        if parsed.get("name") or parsed.get("offers"):
            product_data = parsed
            break

    if not product_data:
        return fallback

    offers = product_data.get("offers") or {}
    if isinstance(offers, list):
        offers = offers[0] if offers else {}
    if not isinstance(offers, dict):
        offers = {}

    availability = offers.get("availability", "")
    is_available = "InStock" in availability

    return Medicine(
        provider="pharmeasy",
        medicine_name=product_data.get("name") or "",
        available=is_available,
        mrp=offers.get("price"),
        price=offers.get("price"),
        url=product_data.get("url") or page_url,
    )


def search(medicine: str) -> List[Medicine]:
    search_url = f"https://pharmeasy.in/search/all?name={medicine}"

    try:
        resp = requests.get(search_url, headers=PHARMEASY_HEADERS, timeout=TIMEOUT)
    except requests.RequestException as e:
        logger.error("PharmEasy search network error: %s", e)
        return []

    if resp.status_code != 200:
        logger.warning("PharmEasy HTTP %s", resp.status_code)
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    product_anchors = soup.find_all(
        "a",
        class_="ProductCard_medicineUnitWrapper__rgDfO ProductCard_defaultWrapper__h4yf3",
    )

    product_urls = [
        f"https://pharmeasy.in{anchor.get('href')}"
        for anchor in product_anchors
        if anchor.get("href")
    ]

    if not product_urls:
        return []

    product_urls = product_urls[:MAX_RESULTS]

    results: List[Medicine] = []
    workers = min(len(product_urls), MAX_WORKERS)

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(_parse_product_page, url) for url in product_urls]
        for future in as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                logger.warning("PharmEasy page parse error: %s", e)

    logger.info("PharmEasy returned %d items", len(results))
    return results