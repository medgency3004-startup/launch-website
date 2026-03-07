import re
import logging
import requests
from typing import List, Optional

from app.models.medicine import Medicine
from app.utils.parsers import parse_price
from app.providers.base import TRUEMEDS_HEADERS, TIMEOUT

logger = logging.getLogger(__name__)

TRUEMEDS_SEARCH_API = "https://nal.tmmumbai.in/CustomerService/getSearchSuggestion"
TRUEMEDS_PINCODE_API = "https://nal.tmmumbai.in/CustomerService/v1/checkPincodeServiceability"

DEFAULT_WAREHOUSE_ID = 20
DEFAULT_VARIANT_ID = 18


def _get_warehouse_id(pincode: str) -> Optional[int]:
    """
    Fetches the correct warehouseId for a given pincode from TrueMeds.
    Returns None if the request fails, so the caller can fall back to the default.
    """
    try:
        resp = requests.get(
            TRUEMEDS_PINCODE_API,
            params={"pincode": pincode},
            headers=TRUEMEDS_HEADERS,
            timeout=TIMEOUT,
        )
        if resp.status_code != 200:
            logger.warning("TrueMeds pincode API HTTP %s", resp.status_code)
            return None

        pincode_data = (
            resp.json()
            .get("responseData", {})
            .get("pincodeData", [])
        )

        if pincode_data and isinstance(pincode_data, list):
            return pincode_data[0].get("warehouseId")

    except requests.RequestException as e:
        logger.warning("TrueMeds pincode lookup failed: %s", e)

    return None


def _build_url(sku_name: str, product_code: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", sku_name.lower()).strip("-")
    return f"https://www.truemeds.in/medicine/{slug}-{product_code}"


def search(query: str, pincode: str = "603203") -> List[Medicine]:
    warehouse_id = _get_warehouse_id(pincode) or DEFAULT_WAREHOUSE_ID

    params = {
        "searchString": query,
        "isMultiSearch": "true",
        "elasticSearchType": "SEARCH_SUGGESTION",
        "warehouseId": warehouse_id,
        "variantId": DEFAULT_VARIANT_ID,
        "searchVariant": "N",
        "orderConfirmSrc": "WEBSITE",
        "sourceVersion": "TM_WEBSITE_V_4.14.0",
    }

    try:
        resp = requests.get(
            TRUEMEDS_SEARCH_API,
            params=params,
            headers=TRUEMEDS_HEADERS,
            timeout=TIMEOUT,
        )
    except requests.RequestException as e:
        logger.error("TrueMeds network error: %s", e)
        return []

    if resp.status_code != 200:
        logger.warning("TrueMeds HTTP %s", resp.status_code)
        return []

    product_list = (
        resp.json()
        .get("responseData", {})
        .get("productList", [])
    )

    results: List[Medicine] = []

    for entry in product_list:
        product = entry.get("product")
        if not isinstance(product, dict):
            continue

        mrp = parse_price(product.get("mrp"))
        selling_price = parse_price(product.get("sellingPrice"))
        sku_name = product.get("skuName") or ""
        product_code = product.get("productCode")

        results.append(
            Medicine(
                provider="truemeds",
                medicine_name=sku_name,
                available=True,
                mrp=mrp,
                price=selling_price if selling_price is not None else mrp,
                url=_build_url(sku_name, product_code) if sku_name and product_code else None,
            )
        )

    logger.info("TrueMeds returned %d items (warehouse %s)", len(results), warehouse_id)
    return results