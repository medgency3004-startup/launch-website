from dataclasses import dataclass
from typing import Optional


@dataclass
class Medicine:
    provider: str
    medicine_name: str
    available: bool
    mrp: Optional[float]
    price: Optional[float]
    url: Optional[str]