import json
from typing import List
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from app.models.medicine import Medicine

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


def parse_medicine_from_page(page_url: str) -> Medicine:
    resp = requests.get(page_url, headers=HEADERS, timeout=200)

    if resp.status_code != 200:
        return Medicine(
            provider="pharmeasy",
            medicine_name="",
            available=False,
            mrp=None,
            price=None,
            url=None,
        )

    soup = BeautifulSoup(resp.text, "html.parser")
    json_matches = soup.find_all(name="script", attrs={"type": "application/ld+json"})
    # the 0th one is trash
    raw = json_matches[1].contents[0]
    data = json.loads(str(raw))
    is_available = (
        True if "InStock" in data.get("offers", {}).get("availability", "") else False
    )

    return Medicine(
        provider="pharmeasy",
        medicine_name=data.get("name"),
        available=is_available,
        price=data.get("offers").get("price"),
        url=data.get("url"),
        mrp=data.get("offers").get("price"),
    )


def search(medicine: str):
    search_results = f"https://pharmeasy.in/search/all?name={medicine}"
    resp = requests.get(search_results, headers=HEADERS, timeout=200)
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

    with ThreadPoolExecutor(max_workers=len(product_page_urls)) as executer:
        futures = [
            executer.submit(parse_medicine_from_page, page_url)
            for page_url in product_page_urls
        ]

        for future in as_completed(futures):
            result = future.result()
            results.append(result)

    print(f"Pharmeasy gave {len(results)} items")
    return results
