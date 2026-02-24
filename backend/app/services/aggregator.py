import logging
import time
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED
from typing import List

from app.models.medicine import Medicine
from app.providers import one_mg, apollo, truemeds, pharmeasy, medkart, netmeds
from app.services.rankers import cheapest_per_provider
from app.config import MAX_AGGREGATOR_WAIT_SECONDS

logger = logging.getLogger(__name__)

# Providers that support pincode-aware search receive it as second arg.
# Providers that are not location-aware (truemeds, pharmeasy, medkart) ignore it.
PROVIDERS = [
    ("1mg",       lambda m, p: one_mg.search(m, p)),
    ("Apollo",    lambda m, p: apollo.search(m, p)),
    ("TrueMeds",  lambda m, p: truemeds.search(m)),
    ("PharmEasy", lambda m, p: pharmeasy.search(m)),
    ("Medkart",   lambda m, p: medkart.search(m)),
    ("Netmeds",   lambda m, p: netmeds.search(m, p)),
]


def _safe_call(name: str, fn) -> List[Medicine]:
    try:
        return fn() or []
    except Exception as e:
        logger.error("Provider %s failed: %s", name, e)
        return []


def search_all_raw(medicine: str, pincode: str = "603203") -> List[Medicine]:
    """Fetch results from all providers concurrently with a hard deadline."""
    results: List[Medicine] = []

    executor = ThreadPoolExecutor(max_workers=len(PROVIDERS))
    try:
        futures = {
            executor.submit(_safe_call, name, lambda fn=fn: fn(medicine, pincode))
            for name, fn in PROVIDERS
        }
        deadline = time.monotonic() + MAX_AGGREGATOR_WAIT_SECONDS
        pending = set(futures)

        while pending:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                logger.warning(
                    "Aggregator deadline reached with %d futures pending", len(pending)
                )
                break
            done, pending = wait(pending, timeout=remaining, return_when=FIRST_COMPLETED)
            for fut in done:
                try:
                    results.extend(fut.result())
                except Exception as e:
                    logger.error("Aggregator future error: %s", e)
    finally:
        executor.shutdown(wait=False, cancel_futures=True)

    return results


def search_all(medicine: str, pincode: str = "603203") -> List[Medicine]:
    """Return the cheapest relevant result per provider."""
    return cheapest_per_provider(search_all_raw(medicine, pincode))