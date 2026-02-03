from pydantic import BaseModel
from typing import Optional

class MedicineOut(BaseModel):
    provider: str
    medicine_name: str
    available: bool
    mrp: Optional[float]
    price: Optional[float]
    url: Optional[str]
