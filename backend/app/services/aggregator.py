from typing import List
<<<<<<< HEAD
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED
import time
from app.models.medicine import Medicine
from app.providers import one_mg, apollo, truemeds, pharmeasy, medkart, netmeds_pw
from app.services.rankers import cheapest_per_provider


def search_all_raw(medicine: str, city: str = "CHENNAI") -> List[Medicine]:
    results: List[Medicine] = []
    providers = [
        ("1mg", lambda: one_mg.search(medicine, city)),
        ("Apollo", lambda: apollo.search(medicine)),
        ("Truemeds", lambda: truemeds.search(medicine)),
        ("PharmEasy", lambda: pharmeasy.search(medicine)),
        ("Medkart", lambda: medkart.search(medicine)),
        ("Netmeds", lambda: netmeds_pw.search(medicine)),
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
        deadline = time.time() + 5.0
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


def search_all(medicine: str, city: str = "CHENNAI") -> List[Medicine]:
=======
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
>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
    """
    Return FILTERED + CHEAPEST medicine per provider.
    """
    results = search_all_raw(medicine, city)
<<<<<<< HEAD
    return cheapest_per_provider(results)
=======
    return cheapest_per_provider(results, medicine)
>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
