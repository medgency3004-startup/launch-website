from fastapi import APIRouter, Query
from typing import List

from app.schemas.medicine import MedicineOut
from app.services.aggregator import search_all_raw

router = APIRouter(prefix="/api", tags=["Medicines"])

@router.get("/search", response_model=List[MedicineOut])
def search_medicine(
    q: str = Query(..., min_length=2),
    city: str = Query("DELHI"),
):
    items = search_all_raw(q, city)
    return [
        {
            "provider": item.provider,
            "medicine_name": item.medicine_name,
            "available": bool(item.available),
            "mrp": item.mrp,
            "price": item.price if item.price is not None else item.mrp,
            "url": item.url,
        }
        for item in items
    ]
