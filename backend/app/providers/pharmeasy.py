from playwright.sync_api import sync_playwright
from typing import List
from datetime import datetime

from app.models.medicine import Medicine
from app.utils.parsers import parse_price


def search(medicine: str) -> List[Medicine]:
    results: List[Medicine] = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            page.goto(f"https://pharmeasy.in/search/all?name={medicine}", timeout=30000)
            page.wait_for_timeout(1500)

            links = page.locator("a[href*='online-medicine-order']").all()

            product_urls = []
            for link in links:
                href = link.get_attribute("href")
                if not href:
                    continue
                if not href.startswith("http"):
                    href = "https://pharmeasy.in" + href
                href = href.split("#")[0]
                if "online-medicine-order/" in href and href not in product_urls:
                    product_urls.append(href)

            url = product_urls[0] if product_urls else None
            if url:
                try:
                    page.goto(url, timeout=20000)
                    page.wait_for_timeout(1000)
                    try:
                        name = page.locator("h1").inner_text()
                    except Exception:
                        name = None
                    try:
                        price_text = page.locator("span[class*='Price']").first.inner_text()
                    except Exception:
                        price_text = None
                    results.append(
                        Medicine(
                            provider="pharmeasy",
                            medicine_name=name or "",
                            available=True,
                            mrp=None,
                            price=parse_price(price_text),
                            url=url,
                        )
                    )
                except Exception:
                    pass

            browser.close()
    except Exception as e:
        print("PharmEasy failed:", e)

    return results
