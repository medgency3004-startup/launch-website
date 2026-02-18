"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMedicineSearch } from "../../hooks/search";
import tata1mg from "../../../assets/images/tata1mg.png";
import pharmacyIcon from "../../../assets/images/pharmacy.png";
import pharmeasyLogo from "../../../assets/images/pharmeasy.png";

// Local OfferCard component
function OfferCard({
  logoAlt,
  provider,
  price,
  href,
}: {
  logoAlt: string;
  provider: string;
  price: string;
  href?: string | null;
}) {
  const providerLogo = useMemo(() => {
    const p = provider.toLowerCase();
    if (p.includes("tata")) return tata1mg;
    if (p.includes("apollo")) return "/logos/apollo.svg";
    if (p.includes("truemeds")) return "/logos/truemeds.svg";
    if (p.includes("pharmeasy")) return pharmeasyLogo;
    if (p.includes("medkart")) return "/logos/medkart.svg";
    if (p.includes("netmeds")) return "/logos/netmeds.svg";
    return pharmacyIcon;
  }, [provider]);
  const buttonLabel = useMemo(() => {
    const p = provider.toLowerCase();
    const noPrice = !price || price === "—";
    if (p.includes("pharmeasy") && noPrice) return "Visit Site";
    return "Select";
  }, [provider, price]);
  return (
    <div className="relative rounded-xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-4 sm:px-6 sm:py-5">

        {/* Provider Logo + Medicine Name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Image src={providerLogo} alt={provider} className="h-9 w-9 sm:h-10 sm:w-10 object-contain flex-shrink-0" width={40} height={40} />
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] sm:text-sm font-semibold text-slate-800 line-clamp-2">{logoAlt}</span>
            <span className="text-[11px] text-slate-500 truncate">View details and pricing on {provider}</span>
          </div>
        </div>

        {/* Price Info */}
        <div className="flex-shrink-0 text-left sm:text-center sm:min-w-[160px]">
          <div className="text-sm sm:text-base md:text-lg font-medium text-slate-600 whitespace-nowrap">
            Starting from ₹{price}
          </div>
        </div>

        {/* Button */}
        {href ? (
          <a
            href={href as string}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex justify-center items-center gap-2 rounded-lg bg-[#2d6f86] px-5 py-2.5 sm:px-7 text-[13px] sm:text-[14px] font-bold text-white shadow-sm transition-all hover:bg-[#1e4b5b] flex-shrink-0 w-full sm:w-auto"
          >
            {buttonLabel}
            <span className="text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { state, setQuery, searchMedicines, clearSearch } = useMedicineSearch();
  const router = useRouter();
  const didInitialSearch = useRef(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<"none" | "price-asc" | "price-desc" | "provider-asc">("none");
  const [cheapestOnly, setCheapestOnly] = useState<boolean>(false);

  const verifiedProviders = useMemo(() => ["tata_1mg", "apollo", "truemeds"], []);
  const allowedProviders = useMemo(
    () => ["tata_1mg", "apollo", "truemeds", "pharmeasy", "medkart"],
    []
  );

  useEffect(() => {
    if (didInitialSearch.current) return;
    didInitialSearch.current = true;
    setQuery(initialQuery);
    if (initialQuery.trim()) {
      searchMedicines(initialQuery);
    }
  }, [initialQuery, setQuery, searchMedicines]);

  const displayedResults = useMemo(() => {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    const allowed = new Set(allowedProviders.map((p) => p.toLowerCase()));
    let list = state.results.filter((r) => {
      if (!allowed.has(String(r.pharmacy).toLowerCase())) return false;
      const inProvider = selectedProviders.length === 0 ? true : selectedProviders.includes(r.pharmacy);
      const inMin = min === undefined ? true : r.price >= min;
      const inMax = max === undefined ? true : r.price <= max;
      return inProvider && inMin && inMax;
    });
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sort === "provider-asc") {
      list = [...list].sort((a, b) => a.pharmacy.localeCompare(b.pharmacy));
    }
    if (cheapestOnly && list.length > 0) {
      const cheapestItem = list.reduce((prev, curr) =>
        (curr.price ?? 0) < (prev.price ?? 0) ? curr : prev
        , list[0]);
      list = [cheapestItem];
    }
    return list;
  }, [state.results, selectedProviders, minPrice, maxPrice, sort, cheapestOnly, allowedProviders]);

  const metrics = useMemo(() => {
    const prices = displayedResults.map((r) => r.price ?? 0).filter((p) => p > 0);
    const cheapest = prices.length ? Math.min(...prices) : null;
    const best = cheapest;
    const verifiedPrices = displayedResults
      .filter((r) => verifiedProviders.includes(r.pharmacy.toLowerCase()))
      .map((r) => r.price ?? 0)
      .filter((p) => p > 0);
    const verified = verifiedPrices.length ? Math.min(...verifiedPrices) : null;
    return { best, cheapest, verified };
  }, [displayedResults, verifiedProviders]);



  const providerOptions = useMemo(() => {
    return [...allowedProviders].sort();
  }, [allowedProviders]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 flex-1">
      {/* Search Bar Area */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <button
          onClick={() => router.push("/")}
          className="hidden sm:inline-flex rounded-xl border border-slate-200 px-5 py-3 text-slate-700 bg-white hover:bg-slate-50"
        >
          Home
        </button>
        <input
          type="text"
          value={state.query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMedicines();
            }
          }}
          placeholder="Search medicines"
          aria-label="Search medicines"
          className="flex-1 min-w-0 rounded-xl border border-slate-200 px-4 py-2 sm:px-5 sm:py-3 shadow-sm outline-none focus:ring-2 focus:ring-[#2d6f86]/20 text-slate-800 text-sm sm:text-base bg-white"
        />
        <button
          onClick={searchMedicines}
          className="rounded-xl bg-[#0B2C3D] px-4 py-2 sm:px-8 sm:py-3 font-semibold text-white transition-all hover:bg-[#163a4d] text-sm sm:text-base"
        >
          Search
        </button>
        <button
          onClick={() => {
            clearSearch();
            router.push("/search");
          }}
          className="rounded-xl border border-slate-200 px-4 py-2 sm:px-5 sm:py-3 text-slate-700 bg-white hover:bg-slate-50 text-sm sm:text-base"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar */}
        <aside className={`space-y-6 ${showFilters ? "" : "hidden"} lg:block`}>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-4 font-bold text-slate-800 text-sm">Sort</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-800"
            >
              <option value="none">None</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="provider-asc">Provider: A–Z</option>
            </select>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-4 font-bold text-slate-800 text-sm">Providers</div>
            <div className="space-y-2">
              {providerOptions.length === 0 && (
                <div className="text-slate-500 text-sm">No providers</div>
              )}
              {providerOptions.map((p) => {
                const checked = selectedProviders.includes(p);
                return (
                  <label key={p} className="flex items-center gap-3 text-sm text-slate-800">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedProviders((prev) =>
                          e.target.checked ? [...prev, p] : prev.filter((x) => x !== p)
                        );
                      }}
                      className="h-4 w-4 accent-[#2d6f86]"
                    />
                    <span>{p}</span>
                  </label>
                );
              })}
            </div>
            {providerOptions.length > 0 && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedProviders(providerOptions)}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Select all
                </button>
                <button
                  onClick={() => setSelectedProviders([])}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-4 font-bold text-slate-800 text-sm">Price Range</div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-800"
              />
              <span className="text-slate-500">to</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-800"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </aside>

        {/* Results Content */}
        <section className="space-y-6">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
            <div className="bg-[#2d6f86] text-white shadow-lg rounded-xl p-4 sm:p-5 border border-slate-100">
              <div className="text-sm font-medium opacity-90">Best</div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold">
                {metrics.best !== null ? `₹${metrics.best.toFixed(2)}` : "—"}
              </div>
              <div className="mt-1 text-xs opacity-70">Starting price today</div>
            </div>
            <button
              type="button"
              onClick={() => setCheapestOnly((v) => !v)}
              className={`bg-white text-slate-800 shadow-sm rounded-xl p-4 sm:p-5 border border-slate-100 text-left ${cheapestOnly ? "ring-2 ring-[#2d6f86]" : ""}`}
            >
              <div className="text-sm font-medium opacity-90">Cheapest</div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold">
                {metrics.cheapest !== null ? `₹${metrics.cheapest.toFixed(2)}` : "—"}
              </div>
              <div className="mt-1 text-xs opacity-70">Starting price today</div>
            </button>
            <div className="bg-white text-slate-800 shadow-sm rounded-xl p-4 sm:p-5 border border-slate-100">
              <div className="text-sm font-medium opacity-90">MedGency Verified</div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold">
                {metrics.verified !== null ? `₹${metrics.verified.toFixed(2)}` : "—"}
              </div>
              <div className="mt-1 text-xs opacity-70">Starting price today</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-sm text-slate-600">
              {state.loading ? "Searching…" : `${displayedResults.length} offers`}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="lg:hidden rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <div className="text-xs text-slate-400">
                {selectedProviders.length > 0 ? `Filtered by ${selectedProviders.length} providers` : "All providers"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {state.loading && (
              <>
                <div className="animate-pulse rounded-2xl bg-white border border-slate-100 p-8 h-28" />
                <div className="animate-pulse rounded-2xl bg-white border border-slate-100 p-8 h-28" />
                <div className="animate-pulse rounded-2xl bg-white border border-slate-100 p-8 h-28" />
              </>
            )}
            {state.error && (
              <div className="text-slate-600 font-medium">
                Some providers are temporarily unavailable. Showing links where possible.
              </div>
            )}
            {!state.loading &&
              displayedResults.map((med, idx) => (
                <OfferCard
                  key={idx}
                  logoAlt={med.name}
                  provider={med.pharmacy}
                  price={
                    med.price !== null && med.price !== undefined && med.price > 0
                      ? med.price.toFixed(2)
                      : "—"
                  }
                  href={med.url ?? undefined}
                />
              ))}
            {!state.loading && displayedResults.length === 0 && !state.error && (
              <div className="text-slate-600 text-sm">No offers found. Try adjusting filters or a different query.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-[#F9FBF2]">
      <Suspense fallback={<div className="p-20 text-center text-[#0B2C3D] font-semibold">Loading Medicine Results...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
