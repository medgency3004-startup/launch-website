import logging
import time
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED
from typing import List

from app.models.medicine import Medicine
from app.providers import one_mg, apollo, truemeds, pharmeasy, medkart, netmeds
from app.services.rankers import cheapest_per_provider
from app.config import MAX_AGGREGATOR_WAIT_SECONDS

logger = logging.getLogger(__name__)

PROVIDERS = [
    ("1mg",       lambda medicine, city: one_mg.search(medicine, city)),
    ("Apollo",    lambda medicine, city: apollo.search(medicine)),
    ("TrueMeds",  lambda medicine, city: truemeds.search(medicine)),
    ("PharmEasy", lambda medicine, city: pharmeasy.search(medicine)),
    ("Medkart",   lambda medicine, city: medkart.search(medicine)),
    ("Netmeds",   lambda medicine, city: netmeds.search(medicine)),
]


def _safe_call(name: str, fn) -> List[Medicine]:
    try:
        return fn() or []
    except Exception as e:
        logger.error("Provider %s failed: %s", name, e)
        return []


def search_all_raw(medicine: str, city: str = "CHENNAI") -> List[Medicine]:
    """Fetch results from all providers concurrently, with a hard deadline."""
    results: List[Medicine] = []

    executor = ThreadPoolExecutor(max_workers=len(PROVIDERS))
    try:
        futures = {
            executor.submit(_safe_call, name, lambda fn=fn: fn(medicine, city))
            for name, fn in PROVIDERS
        }
        deadline = time.monotonic() + MAX_AGGREGATOR_WAIT_SECONDS
        pending = set(futures)

        while pending:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                logger.warning("Aggregator deadline reached with %d futures pending", len(pending))
                break
            done, pending = wait(pending, timeout=remaining, return_when=FIRST_COMPLETED)
            for fut in done:
                try:
                    chunk = fut.result()
                    results.extend(chunk)
                except Exception as e:
                    logger.error("Aggregator future error: %s", e)
    finally:
        executor.shutdown(wait=False, cancel_futures=True)

    return results


def search_all(medicine: str, city: str = "CHENNAI") -> List[Medicine]:
    """Return the cheapest relevant result per provider."""
    results = search_all_raw(medicine, city)
    return cheapest_per_provider(results)