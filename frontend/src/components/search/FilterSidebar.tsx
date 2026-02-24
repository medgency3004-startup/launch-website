import { SortOption } from "@/types";

interface FilterSidebarProps {
    visible: boolean;
    sort: SortOption;
    onSortChange: (s: SortOption) => void;
    providerOptions: string[];
    selectedProviders: string[];
    onProvidersChange: (providers: string[]) => void;
    minPrice: string;
    maxPrice: string;
    onMinPriceChange: (v: string) => void;
    onMaxPriceChange: (v: string) => void;
    onResetPrice: () => void;
}

export function FilterSidebar({
    visible,
    sort,
    onSortChange,
    providerOptions,
    selectedProviders,
    onProvidersChange,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    onResetPrice,
}: FilterSidebarProps) {
    const toggleProvider = (p: string, checked: boolean) => {
        onProvidersChange(
            checked ? [...selectedProviders, p] : selectedProviders.filter((x) => x !== p)
        );
    };

    return (
        <aside className={`space-y-6 ${visible ? "" : "hidden"} lg:block`}>
            {/* Sort */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-4 font-bold text-slate-800 text-sm">Sort</div>
                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-800"
                >
                    <option value="none">None</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="provider-asc">Provider: A–Z</option>
                </select>
            </div>

            {/* Providers */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-4 font-bold text-slate-800 text-sm">Providers</div>
                <div className="space-y-2">
                    {providerOptions.length === 0 && (
                        <div className="text-slate-500 text-sm">No providers</div>
                    )}
                    {providerOptions.map((p) => (
                        <label key={p} className="flex items-center gap-3 text-sm text-slate-800">
                            <input
                                type="checkbox"
                                checked={selectedProviders.includes(p)}
                                onChange={(e) => toggleProvider(p, e.target.checked)}
                                className="h-4 w-4 accent-[#2d6f86]"
                            />
                            <span>{p}</span>
                        </label>
                    ))}
                </div>
                {providerOptions.length > 0 && (
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => onProvidersChange(providerOptions)}
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                            Select all
                        </button>
                        <button
                            onClick={() => onProvidersChange([])}
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-4 font-bold text-slate-800 text-sm">Price Range</div>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => onMinPriceChange(e.target.value)}
                        placeholder="Min"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-800"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => onMaxPriceChange(e.target.value)}
                        placeholder="Max"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-800"
                    />
                </div>
                <div className="mt-3">
                    <button
                        onClick={onResetPrice}
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </aside>
    );
}