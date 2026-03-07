"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
    query: string;
    onQueryChange: (q: string) => void;
    onSearch: () => void;
    onClear: () => void;
    city?: string | null;
    pincode?: string | null;
    locationLoading?: boolean;
    onPincodeChange: (pincode: string) => void;
}

function PincodeEditor({
    city,
    pincode,
    locationLoading,
    onPincodeChange,
}: {
    city?: string | null;
    pincode?: string | null;
    locationLoading?: boolean;
    onPincodeChange: (pincode: string) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) {
            setDraft(pincode ?? "");
            setError("");
            setTimeout(() => inputRef.current?.select(), 0);
        }
    }, [editing, pincode]);

    const commit = () => {
        const trimmed = draft.trim();
        if (!/^\d{6}$/.test(trimmed)) {
            setError("Enter a valid 6-digit pincode");
            return;
        }
        onPincodeChange(trimmed);
        setEditing(false);
        setError("");
    };

    const cancel = () => {
        setEditing(false);
        setError("");
    };

    if (locationLoading) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <LocationIcon />
                Detecting location…
            </div>
        );
    }

    if (editing) {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <LocationIcon />
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={draft}
                        onChange={(e) => {
                            setDraft(e.target.value.replace(/\D/g, ""));
                            setError("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") commit();
                            if (e.key === "Escape") cancel();
                        }}
                        placeholder="Enter 6-digit pincode"
                        className="w-36 rounded-md border border-[#2d6f86] px-2 py-0.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2d6f86]/40"
                    />
                    <button
                        onClick={commit}
                        className="text-xs font-semibold text-[#2d6f86] hover:underline"
                    >
                        Apply
                    </button>
                    <button
                        onClick={cancel}
                        className="text-xs text-slate-400 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
                {error && <p className="ml-5 text-xs text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <LocationIcon />
            {pincode ? (
                <>
                    <span>
                        {city ? `${city} – ` : ""}
                        {pincode}
                    </span>
                    <button
                        onClick={() => setEditing(true)}
                        className="ml-0.5 rounded px-1.5 py-0.5 text-[11px] font-medium text-[#2d6f86] border border-[#2d6f86]/30 hover:bg-[#2d6f86]/10 transition-colors"
                    >
                        Change
                    </button>
                </>
            ) : (
                <>
                    <span>Location unavailable</span>
                    <button
                        onClick={() => setEditing(true)}
                        className="ml-0.5 rounded px-1.5 py-0.5 text-[11px] font-medium text-[#2d6f86] border border-[#2d6f86]/30 hover:bg-[#2d6f86]/10 transition-colors"
                    >
                        Set pincode
                    </button>
                </>
            )}
        </div>
    );
}

function LocationIcon() {
    return (
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

export function SearchBar({
    query,
    onQueryChange,
    onSearch,
    onClear,
    city,
    pincode,
    locationLoading,
    onPincodeChange,
}: SearchBarProps) {
    const router = useRouter();

    return (
        <div className="mb-6 sm:mb-10">
            <div className="flex items-center gap-3 sm:gap-4">
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

            <div className="mt-2 ml-0.5">
                <PincodeEditor
                    city={city}
                    pincode={pincode}
                    locationLoading={locationLoading}
                    onPincodeChange={onPincodeChange}
                />
            </div>
        </div>
    );
}