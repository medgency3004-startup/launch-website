from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class MedicineAvailability:
    # identity
    provider: str               # "tata_1mg", "netmeds", "apollo"
    sku_id: str                 # provider-specific id
    medicine_name: str
    city: str

    # availability
    available: bool
    rx_required: bool

    # pricing
    price: Optional[float]
    mrp: Optional[float]
    discount_percent: Optional[int]

    # delivery
    eta_minutes: Optional[int]        # for emergency providers (1mg)
    delivery_date: Optional[str]      # for scheduled providers (Netmeds)

    # metadata
    url: str
    last_checked_at: datetime
