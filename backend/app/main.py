from app.providers import one_mg
from app.providers import apollo


def run():
    print("🔥 main.py is running")

    all_results = []
    all_results.extend(one_mg.search("Dolo 650", "DELHI"))
    all_results.extend(apollo.search("dolo 650"))

    print(f"Total Medicines: {len(all_results)}")

    for med in all_results:
        print(med)



if __name__ == "__main__":
    run()
