from typing import List
from playwright.sync_api import sync_playwright
from app.models.medicine import Medicine

NETMEDS_SEARCH_URL = "https://www.netmeds.com/products?q={query}"

def search(medicine: str) -> List[Medicine]:
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
                            )
                        )
                except Exception as e:
                    print("❌ Failed to parse Netmeds response:", e)

        page.on("response", handle_response)
        page.goto(
            NETMEDS_SEARCH_URL.format(query=medicine.replace(" ", "%20")),
            timeout=30000,
        )
        page.wait_for_timeout(3000)
        browser.close()

    return results
