def best_fastest(results):
    return sorted(
        [r for r in results if r.available],
        key=lambda r: (
            r.eta_minutes is None,        # real ETA first
            r.eta_minutes or 10**9
        )
    )


def fallback_available(results):
    return [r for r in results if r.available]
