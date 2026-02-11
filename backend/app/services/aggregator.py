from typing import List
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED
import time
from app.models.medicine import Medicine
from app.providers import one_mg, apollo, truemeds, pharmeasy, medkart, netmeds
from app.services.rankers import cheapest_per_provider


def search_all_raw(medicine: str, city: str = "DELHI") -> List[Medicine]:
    results: List[Medicine] = []
    providers = [
        ("1mg", lambda: one_mg.search(medicine, city)),
        ("Apollo", lambda: apollo.search(medicine)),
        ("Truemeds", lambda: truemeds.search(medicine)),
        ("PharmEasy", lambda: pharmeasy.search(medicine)),
        ("Medkart", lambda: medkart.search(medicine)),
        ("Netmeds", lambda: netmeds.search(medicine, city)),
    ]

    def safe_run(name: str, fn):
        try:
            return fn()
        except Exception as e:
            print(f"{name} failed:", e)
            return []

    executor = ThreadPoolExecutor(max_workers=len(providers))
    try:
        futures = {executor.submit(safe_run, name, fn) for (name, fn) in providers}
        deadline = time.time() + 4.0
        pending = set(futures)
        while pending:
            remaining = deadline - time.time()
            if remaining <= 0:
                break
            done, pending = wait(
                pending, timeout=remaining, return_when=FIRST_COMPLETED
            )
            for fut in done:
                try:
                    chunk = fut.result()
                    if chunk:
                        results.extend(chunk)
                except Exception:
                    pass
    finally:
        executor.shutdown(wait=False, cancel_futures=True)
    return results


def search_all(medicine: str, city: str = "DELHI") -> List[Medicine]:
    """
    Return FILTERED + CHEAPEST medicine per provider.
    """
    results = search_all_raw(medicine, city)
    return cheapest_per_provider(results)
