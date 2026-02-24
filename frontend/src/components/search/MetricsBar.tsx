interface Metrics {
    best: number | null;
    cheapest: number | null;
    verified: number | null;
}

interface MetricsBarProps {
    metrics: Metrics;
    cheapestOnly: boolean;
    onToggleCheapest: () => void;
}

export function MetricsBar({ metrics, cheapestOnly, onToggleCheapest }: MetricsBarProps) {
    const fmt = (v: number | null) => (v !== null ? `₹${v.toFixed(2)}` : "—");

    return (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
            <div className="bg-[#2d6f86] text-white shadow-lg rounded-xl p-4 sm:p-5 border border-slate-100">
                <div className="text-sm font-medium opacity-90">Best</div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold">{fmt(metrics.best)}</div>
                <div className="mt-1 text-xs opacity-70">Starting price today</div>
            </div>

            <button
                type="button"
                onClick={onToggleCheapest}
                className={`bg-white text-slate-800 shadow-sm rounded-xl p-4 sm:p-5 border text-left transition-all ${cheapestOnly ? "ring-2 ring-[#2d6f86] border-transparent" : "border-slate-100"
                    }`}
            >
                <div className="text-sm font-medium opacity-90">Cheapest</div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold">{fmt(metrics.cheapest)}</div>
                <div className="mt-1 text-xs opacity-70">Starting price today</div>
            </button>

            <div className="bg-white text-slate-800 shadow-sm rounded-xl p-4 sm:p-5 border border-slate-100">
                <div className="text-sm font-medium opacity-90">MedGency Verified</div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold">{fmt(metrics.verified)}</div>
                <div className="mt-1 text-xs opacity-70">Starting price today</div>
            </div>
        </div>
    );
}