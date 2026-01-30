from app.providers import one_mg
from app.providers import netmeds_pw as netmeds
from app.services.aggregator import best_fastest, fallback_available
from app.config import CITIES


def run():
    print("🔥 main.py is running")

    all_results = []

    for city in CITIES:
        all_results.extend(one_mg.search("Dolo 650", city))
        all_results.extend(netmeds.search("Dolo 650", city))

    print("\n🚑 Emergency (fastest):")
    for r in best_fastest(all_results)[:5]:
        print(r)

    print("\n📦 Fallback (scheduled):")
    for r in fallback_available(all_results)[:5]:
        print(r)


if __name__ == "__main__":
    run()
