from typing import List
from app.models.medicine import Medicine
from app.providers import one_mg, apollo, truemeds
from app.services.rankers import cheapest_per_provider


def search_all_raw(medicine: str, city: str = "DELHI") -> List[Medicine]:
    """
    Return ALL medicines from all providers (NO filtering).
    """
    results: List[Medicine] = []

    try:
        results.extend(one_mg.search(medicine, city))
    except Exception as e:
        print("1mg failed:", e)

    try:
        results.extend(apollo.search(medicine))
    except Exception as e:
        print("Apollo failed:", e)

    try:
        results.extend(truemeds.search(medicine))
    except Exception as e:
        print("Truemeds failed:", e)

    return results


def search_all(medicine: str, city: str = "DELHI") -> List[Medicine]:
    """
    Return FILTERED + CHEAPEST medicine per provider.
    """
    results = search_all_raw(medicine, city)
    return cheapest_per_provider(results, medicine)
