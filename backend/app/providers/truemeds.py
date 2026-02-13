import time
<<<<<<< HEAD
import re
=======
>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
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
        print("❌ TrueMeds network error")
        return []

    if resp.status_code != 200:
        print(f"❌ TrueMeds HTTP {resp.status_code}")
        return []

    data = resp.json()
    product_list = (
        data.get("responseData", {})
            .get("productList", [])
    )

    results: List[Medicine] = []

    for entry in product_list:
        product = entry.get("product")
        if not isinstance(product, dict):
            continue

        mrp = parse_price(product.get("mrp"))
        selling_price = parse_price(product.get("sellingPrice"))

        results.append(
            Medicine(
                provider="truemeds",
                medicine_name=product.get("skuName"),
                available=True,  # ✅ IMPORTANT FIX
                mrp=mrp,
                price=selling_price if selling_price is not None else mrp,
                url=(
<<<<<<< HEAD
                    "https://www.truemeds.in/medicine/"
                    + re.sub(
                        r"[^a-z0-9]+",
                        "-",
                        str(product.get("skuName") or "").lower(),
                    ).strip("-")
                    + "-"
                    + product.get("productCode")
                    if product.get("productCode") and product.get("skuName")
=======
                    "https://www.truemeds.in/product/"
                    + product.get("productCode")
                    if product.get("productCode")
>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
                    else None
                ),
            )
        )

    elapsed_ms = int((time.time() - start) * 1000)
    print(f"TrueMeds gave {len(results)} items ({elapsed_ms} ms)")

    return results
