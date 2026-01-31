import time
import requests
from typing import List

from app.models.medicine import Medicine
from app.utils.parsers import parse_price


TRUEMEDS_SEARCH_API = (
    "https://nal.tmmumbai.in/CustomerService/getSearchSuggestion"
)

BASE_HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "origin": "https://www.truemeds.in",
    "referer": "https://www.truemeds.in/",
    "user-agent": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/18.5 Mobile Safari/605.1.15"
    ),
    "sec-fetch-site": "cross-site",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
}


def search(
    query: str,
    warehouse_id: int = 20,
    variant_id: int = 18,
) -> List[Medicine]:

    params = {
        "searchString": query,
        "isMultiSearch": "true",
        "elasticSearchType": "SEARCH_SUGGESTION",
        "warehouseId": warehouse_id,
        "variantId": variant_id,
        "searchVariant": "N",
        "orderConfirmSrc": "WEBSITE",
        "sourceVersion": "TM_WEBSITE_V_4.14.0",
    }

    start = time.time()

    try:
        resp = requests.get(
            TRUEMEDS_SEARCH_API,
            params=params,
            headers=BASE_HEADERS,
            timeout=15,
        )
    except requests.RequestException:
        print("TrueMeds failed (network error)")
        return []

    if resp.status_code != 200:
        print(f"TrueMeds HTTP {resp.status_code}")
        return []

    data = resp.json()

    # ✅ CORRECT JSON PATH
    response_data = data.get("responseData", {})
    product_list = response_data.get("productList", [])

    results: List[Medicine] = []

    for entry in product_list:
        product = entry.get("product")
        if not isinstance(product, dict):
            continue

        results.append(
            Medicine(
                provider="truemeds",
                medicine_name=product.get("skuName"),
                available=(product.get("qty", 0) or 0) > 0,
                mrp=parse_price(product.get("mrp")),
                price=parse_price(product.get("sellingPrice")),
                url=(
                    "https://www.truemeds.in/product/"
                    + product.get("productCode")
                    if product.get("productCode")
                    else None
                ),
            )
        )

    elapsed_ms = int((time.time() - start) * 1000)

    # ✅ PRINT LIKE OTHER PROVIDERS
    print(f"TrueMeds gave {len(results)} items ({elapsed_ms} ms)")

    return results
