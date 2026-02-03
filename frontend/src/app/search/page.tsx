"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Local OfferCard component
function OfferCard({ logoAlt, price }: { logoAlt: string; price: string }) {
  return (
    <div className="relative rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 px-10 py-8">
        
        {/* Medicine Name */}
        <div className="w-48 flex items-center">
          <span className="text-xl font-bold text-slate-800">{logoAlt}</span>
        </div>

        {/* Price Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="text-xl font-medium text-slate-600">
             X Deals Starting from {price}₹
          </div>
        </div>

        {/* Action Button */}
        <button className="group inline-flex items-center gap-2 rounded-xl bg-[#2d6f86] px-8 py-3 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-[#1e4b5b]">
          Select
          <span className="text-lg transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Paracetamol";

  const highlights = [
    { title: "Best", price: 24, color: "bg-[#2d6f86] text-white", shadow: "shadow-lg" },
    { title: "Cheapest", price: 10, color: "bg-white text-slate-800", shadow: "shadow-sm" },
    { title: "MedGency Verified", price: 11, color: "bg-white text-slate-800", shadow: "shadow-sm" },
  ];

  const results = [
    { name: "Paracetamol" },
    { name: "Tylenol" },
    { name: "Panadol" },
    { name: "Calpol" },
    { name: "Crocin" },
    { name: "Dolo 650" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 flex-1">
      {/* Search Bar Area */}
      <div className="flex gap-4 mb-10">
        <input
          type="text"
          defaultValue={query}
          className="flex-1 rounded-xl border border-slate-200 px-6 py-4 shadow-sm outline-none focus:ring-2 focus:ring-[#2d6f86]/20 text-slate-800"
        />
        <button className="rounded-xl bg-[#0B2C3D] px-10 font-semibold text-white transition-all hover:bg-[#163a4d]">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center gap-2 font-bold text-slate-800">
              <span className="text-sm">MedGency Tools</span>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              🔔 Get Price Alerts
            </button>
          </div>
          <div className="h-[500px] rounded-2xl bg-white/50 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm italic text-center px-4">
            Advertisement Placeholder
          </div>
        </aside>

        {/* Results Content */}
        <section className="space-y-8">
          {/* Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((item, idx) => (
              <div key={idx} className={`${item.color} ${item.shadow} rounded-2xl p-6 border border-slate-100`}>
                <div className="text-sm font-medium opacity-90">{item.title}</div>
                <div className="mt-2 text-4xl font-bold">₹{item.price}</div>
                <div className="mt-1 text-xs opacity-70">Starting price today</div>
              </div>
            ))}
          </div>

          {/* Result List */}
          <div className="space-y-4">
            {results.map((med, idx) => (
              <OfferCard
                key={idx}
                logoAlt={med.name}
                price="X"
              />
            ))}
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