import re
from typing import Optional
from datetime import datetime


def parse_price(value) -> Optional[float]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        cleaned = value.replace("₹", "").strip()
        try:
            return float(cleaned)
        except ValueError:
            return None
    return None


def parse_discount(discount) -> Optional[int]:
    """
    Extracts discount percentage from strings like '12% OFF', '9% off', '5%'.
    """
    if not discount:
        return None
    match = re.search(r"(\d+)", str(discount))
    return int(match.group(1)) if match else None


def parse_eta(eta_text: str) -> Optional[int]:
    """
    Extracts minutes from strings like 'Get in 30 mins'.
    """
    if not eta_text:
        return None
    match = re.search(r"(\d+)\s*mins", eta_text)
    return int(match.group(1)) if match else None


def parse_delivery_date(iso_ts: str) -> Optional[str]:
    """
    Converts ISO timestamp to YYYY-MM-DD string.
    """
    if not iso_ts:
        return None
    try:
        return datetime.fromisoformat(iso_ts.replace("Z", "+00:00")).date().isoformat()
    except (ValueError, TypeError):
        return None