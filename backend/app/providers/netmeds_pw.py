from typing import List
<<<<<<< HEAD
from playwright.sync_api import sync_playwright
from app.models.medicine import Medicine

NETMEDS_SEARCH_URL = "https://www.netmeds.com/products?q={query}"

def search(medicine: str) -> List[Medicine]:
=======
from datetime import datetime

from playwright.sync_api import sync_playwright

from app.models.medicine import Medicine
from app.utils.parsers import parse_discount, parse_delivery_date


NETMEDS_SEARCH_URL = "https://www.netmeds.com/products?q={query}"


def search(medicine: str, city: str) -> List[Medicine]:
    """
    Netmeds provider using Playwright.
    Calls Netmeds API from inside browser context.
    """

>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
    results: List[Medicine] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) "
                "Version/18.5 Mobile/15E148 Safari/604.1"
            )
        )
        page = context.new_page()

<<<<<<< HEAD
        def handle_response(response):
            if "catalog/v1.0/products/serviceability" in response.url:
                try:
                    data = response.json()
                    items = data.get("items", [])
                    for item in items:
                        price = item.get("price", {})
                        results.append(
                            Medicine(
                                provider="netmeds",
                                medicine_name=item.get("slug", "")
                                .replace("-", " ")
                                .title(),
                                available=item.get("is_serviceable", False)
                                and item.get("quantity", 0) > 0,
                                mrp=price.get("marked"),
                                price=price.get("effective"),
                                url=f"https://www.netmeds.com/prescriptions/{item.get('slug')}",
=======
        # 1️⃣ Capture API response
        def handle_response(response):
            if "catalog/v1.0/products/serviceability" in response.url:
                print("✅ Netmeds API response intercepted")
                try:
                    data = response.json()
                    items = data.get("items", [])

                    for item in items:
                        price = item.get("price", {})
                        delivery = item.get("delivery_promise") or {}


                        results.append(
                            Medicine(
                                provider="netmeds",
                                sku_id=str(item.get("item_id")),
                                medicine_name=item.get("slug", "")
                                .replace("-", " ")
                                .title(),
                                city=city,

                                available=item.get("is_serviceable", False)
                                and item.get("quantity", 0) > 0,
                                rx_required=False,

                                price=price.get("effective"),
                                mrp=price.get("marked"),
                                discount_percent=parse_discount(
                                    item.get("discount")
                                ),

                                eta_minutes=None,
                                delivery_date=parse_delivery_date(
                                    delivery.get("min")
                                ),

                                url=f"https://www.netmeds.com/prescriptions/{item.get('slug')}",
                                last_checked_at=datetime.utcnow(),
>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
                            )
                        )
                except Exception as e:
                    print("❌ Failed to parse Netmeds response:", e)

        page.on("response", handle_response)
<<<<<<< HEAD
        page.goto(
            NETMEDS_SEARCH_URL.format(query=medicine.replace(" ", "%20")),
            timeout=30000,
        )
        page.wait_for_timeout(3000)
=======

        # 2️⃣ Open Netmeds search page
        page.goto(
            NETMEDS_SEARCH_URL.format(
                query=medicine.replace(" ", "%20")
            ),
            timeout=60000,
        )

        # 3️⃣ Give site time to load & fire API
        page.wait_for_timeout(8000)

>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
        browser.close()

    return results
