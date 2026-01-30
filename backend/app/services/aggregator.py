def best_fastest(results):
    """
    Emergency ranking:
    Only providers with real ETA minutes
    """
    available = [
        r for r in results
        if r.available and r.eta_minutes is not None
    ]
    return sorted(available, key=lambda r: r.eta_minutes)


def fallback_available(results):
    return [
        r for r in results
        if r.available and r.delivery_date is not None
    ]

