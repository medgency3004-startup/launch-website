from typing import List, Dict
from app.models.medicine import Medicine

MEDICINE_FORMS = (
    "tablet", "capsule", "suspension", "syrup",
    "drops", "injection", "cream", "gel", "ointment",
)

# Providers whose results are noisy and need form-based filtering
STRICT_FORM_PROVIDERS = {"tata_1mg", "apollo"}


def is_relevant(med: Medicine) -> bool:
    """
    Returns True if the result looks like an actual medicine listing.
    TrueMeds is generic-heavy and does not need form filtering.
    1mg and Apollo are noisy and restricted to known medicine forms.
    """
    if med.provider in STRICT_FORM_PROVIDERS:
        name = (med.medicine_name or "").lower()
        return any(form in name for form in MEDICINE_FORMS)
    return True


def cheapest_per_provider(results: List[Medicine]) -> List[Medicine]:
    """
    From all results, return the single cheapest relevant medicine per provider.
    Effective price = selling price if set, otherwise MRP.
    """
    best: Dict[str, Medicine] = {}

    for med in results:
        if not med.available:
            continue
        if not is_relevant(med):
            continue

        effective_price = med.price if med.price is not None else med.mrp
        if effective_price is None:
            continue

        current = best.get(med.provider)
        if current is None:
            best[med.provider] = med
            continue

        current_price = current.price if current.price is not None else current.mrp
        if current_price is None or effective_price < current_price:
            best[med.provider] = med

    return list(best.values())