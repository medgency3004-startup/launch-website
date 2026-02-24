from pydantic import BaseModel
from typing import Optional


class MedicineOut(BaseModel):
    provider: str
    medicine_name: str
    available: bool
    mrp: Optional[float] = None
    price: Optional[float] = None
    url: Optional[str] = None