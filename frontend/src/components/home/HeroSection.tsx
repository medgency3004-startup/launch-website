"use client";

import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { POPULAR_SEARCHES } from "@/constants/providers";
import { useRef } from "react";

export function HeroSection() {
    const { state, setQuery } = useSearch();
    const router = useRouter();
    const navLockRef = useRef(false);

    const navigate = (url: string) => {
        if (navLockRef.current) return;
        navLockRef.current = true;
        router.push(url);
        setTimeout(() => { navLockRef.current = false; }, 600);
    };

    const handleSearch = () => {
        const q = state.query.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
    };

    return (
        <section className="bg-gradient-to-b from-white to-[#EEF3CC] px-4 sm:px-6 md:px-12 py-14 sm:py-18 md:py-28">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#E7F6FB] text-[#0B2C3D] px-3 py-2 text-[11px] sm:text-xs font-semibold">
                        Connecting care in critical moments
                    </div>
                    <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-serif leading-tight text-[#0B2C3D]">
                        Healthcare,
                        <br />
                        Without The Guesswork
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-[#0B2C3D]">
                        Explore medicine prices across trusted providers and save.
                    </p>
                </div>

                {/* Search input */}
                <div className="mt-6 sm:mt-8 flex w-full max-w-3xl rounded-full bg-white ring-1 ring-slate-200 shadow-lg">
                    <input
                        value={state.query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Search medicines (e.g., Paracetamol)..."
                        className="flex-1 px-5 sm:px-6 py-3 sm:py-4 rounded-l-full outline-none text-[#0B2C3D] placeholder:text-slate-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-[#0B2C3D] text-white px-6 sm:px-8 md:px-10 font-bold rounded-r-full hover:bg-[#163a4d] transition-colors"
                    >
                        Search
                    </button>
                </div>

                {/* Popular searches */}
                <div className="mt-4">
                    <div className="text-xs text-slate-600 mb-2">Popular searches</div>
                    <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="inline-flex gap-2 sm:gap-3 whitespace-nowrap pr-2">
                            {POPULAR_SEARCHES.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                                    className="rounded-full border border-slate-200 px-3 sm:px-4 py-2 text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {state.error && (
                    <p className="mt-2 text-red-600 font-medium">{state.error}</p>
                )}

                <div className="mt-6">
                    <button
                        onClick={() => navigate("/search")}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0B2C3D] text-white px-6 py-3 text-sm font-semibold hover:bg-[#163a4d] transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </section>
    );
}