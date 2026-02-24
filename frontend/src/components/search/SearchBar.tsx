"use client";

import { useRouter } from "next/navigation";

interface SearchBarProps {
    query: string;
    onQueryChange: (q: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

export function SearchBar({ query, onQueryChange, onSearch, onClear }: SearchBarProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
            <button
                onClick={() => router.push("/")}
                className="hidden sm:inline-flex rounded-xl border border-slate-200 px-5 py-3 text-slate-700 bg-white hover:bg-slate-50"
            >
                Home
            </button>

            <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                placeholder="Search medicines"
                aria-label="Search medicines"
                className="flex-1 min-w-0 rounded-xl border border-slate-200 px-4 py-2 sm:px-5 sm:py-3 shadow-sm outline-none focus:ring-2 focus:ring-[#2d6f86]/20 text-slate-800 text-sm sm:text-base"
            />

            <button
                onClick={onSearch}
                className="rounded-xl bg-[#0B2C3D] px-4 py-2 sm:px-8 sm:py-3 font-semibold text-white transition-all hover:bg-[#163a4d] text-sm sm:text-base"
            >
                Search
            </button>

            <button
                onClick={onClear}
                className="rounded-xl border border-slate-200 px-4 py-2 sm:px-5 sm:py-3 text-slate-700 bg-white hover:bg-slate-50 text-sm sm:text-base"
            >
                Clear
            </button>
        </div>
    );
}