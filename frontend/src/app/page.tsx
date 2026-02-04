"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Added for redirection
import { useMedicineSearch } from "../hooks/search";
import { useRef } from "react";

// logos
import pharmacy from "../../assets/images/pharmacy.png";
import wellness from "../../assets/images/wellness.png";
import tata1mg from "../../assets/images/tata1mg.png";
import pharmeasy from "../../assets/images/pharmeasy.png";
import clarityIcon from "../../assets/images/computer.png";
import patientIcon from "../../assets/images/patient.png";

// icons
import searchIcon from "../../assets/icons/search.png";
import compareIcon from "../../assets/icons/compare.png";
import cartIcon from "../../assets/icons/cart.png";
import thumbsUp from "../../assets/icons/thumbsup.png";

export default function HomePage() {
  const { state, setQuery } = useMedicineSearch();
  const router = useRouter();
  const navLockRef = useRef(false);

  // Handle Redirection to Search Results Page
  const handleSearch = () => {
    if (navLockRef.current) return;
    const q = state.query.trim();
    if (!q) return;
    navLockRef.current = true;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setTimeout(() => {
      navLockRef.current = false;
    }, 600);
  };

  const handleNavigate = (url: string) => {
    if (navLockRef.current) return;
    navLockRef.current = true;
    router.push(url);
    setTimeout(() => {
      navLockRef.current = false;
    }, 600);
  };

  return (
    <main className="w-full">
      {/* HERO & SEARCH */}
      <section className="bg-gradient-to-b from-white to-[#EEF3CC] px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E7F6FB] text-[#0B2C3D] px-4 py-2 text-xs font-semibold">
              Connecting care in critical moments
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif leading-tight text-[#0B2C3D]">
              Healthcare,
              <br />
              Without The Guesswork
            </h1>
            <p className="mt-4 text-lg text-[#0B2C3D]">
              Explore medicine prices across trusted providers and save.
            </p>
          </div>

          {/* SEARCH INPUT */}
          <div className="mt-8 flex w-full max-w-3xl rounded-full bg-white ring-1 ring-slate-200 shadow-lg">
            <input
              value={state.query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search medicines (e.g., Paracetamol)..."
              className="flex-1 px-6 py-4 rounded-l-full outline-none text-[#0B2C3D] placeholder:text-slate-500"
            />
            <button
              onClick={handleSearch}
              className="bg-[#0B2C3D] text-white px-8 md:px-10 font-bold rounded-r-full hover:bg-[#163a4d] transition-colors"
            >
              Search
            </button>
          </div>

        <div className="mt-4 flex gap-3">
          {["Paracetamol", "Dolo 650", "Crocin"].map((q) => (
            <button
              key={q}
              onClick={() => handleNavigate(`/search?q=${encodeURIComponent(q)}`)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {state.error && (
          <p className="mt-2 text-red-600 font-medium">{state.error}</p>
        )}
        <div className="mt-6">
          <button
            onClick={() => handleNavigate("/search")}
            className="inline-flex items-center gap-2 rounded-full bg-[#0B2C3D] text-white px-6 py-3 text-sm font-semibold hover:bg-[#163a4d] transition-colors"
          >
            Get Started
          </button>
        </div>
        </div>
      </section>

      {/* PHARMACIES TRUST SECTION */}
      <section className="px-12 py-16 text-center border-b border-gray-100">
        <p className="text-[#0B2C3D] text-lg mb-8 opacity-70">
          Compare across popular pharmacies nationwide
        </p>

        <div className="flex justify-center items-center gap-14 grayscale opacity-60">
          <Image src={pharmacy} alt="Pharmacy" className="h-10 w-auto" />
          <Image src={wellness} alt="Wellness Forever" className="h-10 w-auto" />
          <Image src={tata1mg} alt="Tata 1mg" className="h-10 w-auto" />
          <Image src={pharmeasy} alt="PharmEasy" className="h-10 w-auto" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-12 py-24 text-center">
        <h2 className="text-4xl font-serif text-[#0B2C3D] mb-16">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 flex items-center justify-center">
              <Image src={searchIcon} alt="Search" />
            </div>
            <h4 className="mt-6 text-xl font-bold text-[#0B2C3D]">1. Search</h4>
            <p className="mt-2 text-slate-600">
              Search your prescribed medicine
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-20 w-20 flex items-center justify-center">
              <Image src={compareIcon} alt="Compare" />
            </div>
            <h4 className="mt-6 text-xl font-bold text-[#0B2C3D]">2. Compare</h4>
            <p className="mt-2 text-slate-600">
              Compare medicine prices across many pharmacies.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-20 w-20 flex items-center justify-center">
              <Image src={cartIcon} alt="Purchase" />
            </div>
            <h4 className="mt-6 text-xl font-bold text-[#0B2C3D]">3. Purchase</h4>
            <p className="mt-2 text-slate-600">
              Request your purchase with a tap
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-12 py-24 text-center bg-[#F9FAFB]">
        <h2 className="text-4xl font-serif text-[#0B2C3D] mb-16">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <Image src={clarityIcon} alt="Clarity" className="mb-6 h-12 w-auto" />
            <p className="text-lg font-bold text-[#0B2C3D]">
              Clarity over complexity
            </p>
          </div>

          <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <Image src={thumbsUp} alt="Convenience" className="mb-6 h-12 w-auto" />
            <p className="text-lg font-bold text-[#0B2C3D]">
              One-search convenience
            </p>
          </div>

          <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <Image src={patientIcon} alt="Patient First" className="mb-6 h-12 w-auto" />
            <p className="text-lg font-bold text-[#0B2C3D]">
              Patient-first, not provider-first
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
