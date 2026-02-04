from playwright.sync_api import sync_playwright
from typing import List
from app.models.medicine import Medicine
from app.utils.parsers import parse_price

def _collect_product_urls(page) -> List[str]:
    links = page.locator("a[href*='online-medicine-order']").all()
    urls: List[str] = []
    for link in links:
        href = link.get_attribute("href")
        if not href:
            continue
        if not href.startswith("http"):
            href = "https://pharmeasy.in" + href
        href = href.split("#")[0]
        if "online-medicine-order/" in href and href not in urls:
            urls.append(href)
    return urls

def _scrape_product(page, url: str) -> Medicine:
    page.goto(url, timeout=20000, wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    try:
        name = page.locator("h1").inner_text()
    except Exception:
        name = None
    try:
        price_text = page.locator("span[class*='Price']").first.inner_text()
    except Exception:
        price_text = None
    return Medicine(
        provider="pharmeasy",
        medicine_name=name or "",
        available=True,
        mrp=None,
        price=parse_price(price_text),
        url=url,
    )

def search(medicine: str) -> List[Medicine]:
    results: List[Medicine] = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(**p.devices["iPhone 13"])
            page = context.new_page()
            try:
                page.goto(
                    f"https://pharmeasy.in/search/all?name={medicine}",
                    timeout=10000,
                    wait_until="domcontentloaded",
                )
            except Exception:
                results.append(
                    Medicine(
                        provider="pharmeasy",
                        medicine_name=medicine,
                        available=True,
                        mrp=None,
                        price=None,
                        url=f"https://pharmeasy.in/search/all?name={medicine}",
                    )
                )
                browser.close()
                return results
            try:
                page.wait_for_selector("a[href*='online-medicine-order']", timeout=1500)
            except Exception:
                pass
            urls = _collect_product_urls(page)
            if not urls:
                results.append(
                    Medicine(
                        provider="pharmeasy",
                        medicine_name=medicine,
                        available=True,
                        mrp=None,
                        price=None,
                        url=f"https://pharmeasy.in/search/all?name={medicine}",
                    )
                )
                browser.close()
                return results
            for url in urls[:10]:
                try:
                    slug = url.split("online-medicine-order/")[-1].split("/")[0]
                    name = slug.replace("-", " ").title() if slug else None
                    results.append(
                        Medicine(
                            provider="pharmeasy",
                            medicine_name=name or "",
                            available=True,
                            mrp=None,
                            price=None,
                            url=url,
                        )
                    )
                except Exception:
                    pass
            browser.close()
    except Exception as e:
        print("PharmEasy failed:", e)
        try:
            results.append(
                Medicine(
                    provider="pharmeasy",
                    medicine_name=medicine,
                    available=True,
                    mrp=None,
                    price=None,
                    url=f"https://pharmeasy.in/search/all?name={medicine}",
                )
            )
        except Exception:
            pass
    return results
