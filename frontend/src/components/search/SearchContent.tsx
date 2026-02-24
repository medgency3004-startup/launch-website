"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { useLocation } from "@/hooks/useLocation";
import { ALLOWED_PROVIDERS, VERIFIED_PROVIDERS } from "@/constants/providers";
import { SortOption } from "@/types";
import { SearchBar } from "./SearchBar";
import { FilterSidebar } from "./FilterSidebar";
import { MetricsBar } from "./MetricsBar";
import { ResultsList } from "./ResultsList";

const DEFAULT_PINCODE = "603203";

export function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get("q") ?? "";

    const { state, setQuery, searchMedicines, clearSearch } = useSearch();
    const { city, pincode, loading: locationLoading } = useLocation();
    const didInitialSearch = useRef(false);

    const [showFilters, setShowFilters] = useState(false);
    const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState<SortOption>("none");
    const [cheapestOnly, setCheapestOnly] = useState(false);

    const allowedSet = useMemo(
        () => new Set(ALLOWED_PROVIDERS.map((p) => p.toLowerCase())),
        []
    );
    const providerOptions = useMemo(() => [...ALLOWED_PROVIDERS].sort(), []);

    // Wait for location before running the initial search
    useEffect(() => {
        if (locationLoading) return;
        if (didInitialSearch.current) return;
        didInitialSearch.current = true;
        setQuery(initialQuery);
        if (initialQuery.trim()) {
            searchMedicines(initialQuery, pincode ?? DEFAULT_PINCODE);
        }
    }, [locationLoading, initialQuery, pincode, setQuery, searchMedicines]);

    const filteredResults = useMemo(() => {
        const min = minPrice ? Number(minPrice) : undefined;
        const max = maxPrice ? Number(maxPrice) : undefined;

        let list = state.results.filter((r) => {
            if (!allowedSet.has(r.pharmacy.toLowerCase())) return false;
            if (selectedProviders.length > 0 && !selectedProviders.includes(r.pharmacy)) return false;
            if (min !== undefined && r.price < min) return false;
            if (max !== undefined && r.price > max) return false;
            return true;
        });

        if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
        else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
        else if (sort === "provider-asc") list = [...list].sort((a, b) => a.pharmacy.localeCompare(b.pharmacy));

        if (cheapestOnly && list.length > 0) {
            const cheapest = list.reduce((prev, curr) => (curr.price < prev.price ? curr : prev));
            list = [cheapest];
        }

        return list;
    }, [state.results, selectedProviders, minPrice, maxPrice, sort, cheapestOnly, allowedSet]);

    const metrics = useMemo(() => {
        const prices = filteredResults.map((r) => r.price).filter((p) => p > 0);
        const verifiedPrices = filteredResults
            .filter((r) => VERIFIED_PROVIDERS.includes(r.pharmacy.toLowerCase() as never))
            .map((r) => r.price)
            .filter((p) => p > 0);

        return {
            best: prices.length ? Math.min(...prices) : null,
            cheapest: prices.length ? Math.min(...prices) : null,
            verified: verifiedPrices.length ? Math.min(...verifiedPrices) : null,
        };
    }, [filteredResults]);

    const handleClear = () => {
        clearSearch();
        router.push("/search");
    };

    return (
        <main className="mx-auto w-full max-w-6xl px-6 py-8 flex-1">
            <SearchBar
                query={state.query}
                onQueryChange={setQuery}
                onSearch={() => searchMedicines(undefined, pincode ?? DEFAULT_PINCODE)}
                onClear={handleClear}
                city={city}
                locationLoading={locationLoading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                <FilterSidebar
                    visible={showFilters}
                    sort={sort}
                    onSortChange={setSort}
                    providerOptions={providerOptions}
                    selectedProviders={selectedProviders}
                    onProvidersChange={setSelectedProviders}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                    onResetPrice={() => { setMinPrice(""); setMaxPrice(""); }}
                />

                <section className="space-y-6">
                    <MetricsBar
                        metrics={metrics}
                        cheapestOnly={cheapestOnly}
                        onToggleCheapest={() => setCheapestOnly((v) => !v)}
                    />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="text-sm text-slate-600">
                            {locationLoading || state.loading
                                ? "Searching…"
                                : `${filteredResults.length} offers`}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters((v) => !v)}
                                className="lg:hidden rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                            >
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                            <div className="text-xs text-slate-400">
                                {selectedProviders.length > 0
                                    ? `Filtered by ${selectedProviders.length} providers`
                                    : "All providers"}
                            </div>
                        </div>
                    </div>

                    <ResultsList
                        results={filteredResults}
                        loading={locationLoading || state.loading}
                        error={state.error}
                    />
                </section>
            </div>
        </main>
    );
}