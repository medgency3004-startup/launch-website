from typing import List
from concurrent.futures import ThreadPoolExecutor, as_completed
from app.models.medicine import Medicine
from app.providers import one_mg, apollo, truemeds, pharmeasy, medkart, netmeds_pw
from app.services.rankers import cheapest_per_provider


def search_all_raw(medicine: str, city: str = "DELHI") -> List[Medicine]:
    """
    Return ALL medicines from all providers (NO filtering).
    """
    results: List[Medicine] = []

    def run_one_mg():
        try:
            return one_mg.search(medicine, city)
        except Exception as e:
            print("1mg failed:", e)
            return []

    def run_apollo():
        try:
            return apollo.search(medicine)
        except Exception as e:
            print("Apollo failed:", e)
            return []

    def run_truemeds():
        try:
            return truemeds.search(medicine)
        except Exception as e:
            print("Truemeds failed:", e)
            return []

    def run_pharmeasy():
        try:
            return pharmeasy.search(medicine)
        except Exception as e:
            print("PharmEasy failed:", e)
            return []

    def run_medkart():
        try:
            return medkart.search(medicine)
        except Exception as e:
            print("Medkart failed:", e)
            return []

    def run_netmeds():
        try:
            return netmeds_pw.search(medicine, city)
        except Exception as e:
            print("Netmeds failed:", e)
            return []

    tasks = [run_one_mg, run_apollo, run_truemeds, run_pharmeasy, run_medkart, run_netmeds]

    with ThreadPoolExecutor(max_workers=len(tasks)) as executor:
        future_map = {executor.submit(fn): fn for fn in tasks}
        try:
            for future in as_completed(future_map, timeout=8):
                try:
                    chunk = future.result()
                    if chunk:
                        results.extend(chunk)
                except Exception:
                    pass
        except TimeoutError:
            pass

    return results


def search_all(medicine: str, city: str = "DELHI") -> List[Medicine]:
    """
    Return FILTERED + CHEAPEST medicine per provider.
    """
    results = search_all_raw(medicine, city)
    return cheapest_per_provider(results, medicine)
