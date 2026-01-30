import re
from typing import Optional
from datetime import datetime
import re


def parse_price(value: str) -> Optional[float]:
    if not value:
        return None
    return float(value.replace("₹", "").strip())


def parse_discount(discount):
    """
    Extracts discount percentage from strings like:
    '12% OFF', '9% off', '5%', etc.
    """
    if not discount:
        return None

    match = re.search(r"(\d+)", str(discount))
    if not match:
        return None

    return int(match.group(1))


def parse_eta(eta_text: str) -> Optional[int]:
    if not eta_text:
        return None

    # examples: "Get in 30 mins", "Get by 5pm, Today"
    match = re.search(r"(\d+)\s*mins", eta_text)
    if match:
        return int(match.group(1))

    return None


def parse_delivery_date(iso_ts: str) -> str | None:
    """
    Convert ISO timestamp → YYYY-MM-DD
    """
    if not iso_ts:
        return None

    try:
        return datetime.fromisoformat(
            iso_ts.replace("Z", "+00:00")
        ).date().isoformat()
    except Exception:
        return None

