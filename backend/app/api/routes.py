import logging
from typing import List

from fastapi import APIRouter, Query

from app.schemas.medicine import MedicineOut
from app.services.aggregator import search_all, search_all_raw

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Medicines"])


@router.get("/search", response_model=List[MedicineOut])
def search_medicine(
    q: str = Query(..., min_length=2),
    city: str = Query("CHENNAI"),
    raw: bool = Query(False, description="Return unfiltered results from all providers"),
):
    try:
        items = search_all_raw(q, city) if raw else search_all(q, city)
        return [
            MedicineOut(
                provider=item.provider,
                medicine_name=item.medicine_name,
                available=bool(item.available),
                mrp=item.mrp,
                price=item.price if item.price is not None else item.mrp,
                url=item.url,
            )
            for item in items
        ]
    except Exception as e:
        logger.error("Search endpoint error: %s", e)
        return []