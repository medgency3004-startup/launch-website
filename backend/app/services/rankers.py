from typing import List, Dict
from app.models.medicine import Medicine


def is_relevant(med: Medicine) -> bool:
    """
    Decide whether a medicine is relevant to the user's query.
    This logic is QUERY-DRIVEN, not hard-coded to any brand.
    """

    name = (med.medicine_name or "").lower()

    # Provider-specific noise handling
    if med.provider != "truemeds":
        # 1mg & Apollo are noisy → restrict to medicine forms
        allowed_forms = (
            "tablet",
            "capsule",
            "suspension",
            "syrup",
            "drops",
            "injection",
        )
        if not any(form in name for form in allowed_forms):
            return False

    # TrueMeds is generic-heavy → do not restrict by form
    return True


def cheapest_per_provider(results: List[Medicine]) -> List[Medicine]:
    """
    From all results, pick the cheapest relevant medicine per provider.
    Uses selling price if available, otherwise falls back to MRP.
    """

    best: Dict[str, Medicine] = {}

    for med in results:
        # availability check
        if not med.available:
            continue

        # price normalization (TrueMeds fallback handled here)
        effective_price = med.price if med.price is not None else med.mrp
        if effective_price is None:
            continue

        # relevance filtering
        if not is_relevant(med):
            continue

        current = best.get(med.provider)
        if current is None:
            best[med.provider] = med
            continue

        current_price = current.price if current.price is not None else current.mrp

        if current_price is None or effective_price < current_price:
            best[med.provider] = med

    return list(best.values())
