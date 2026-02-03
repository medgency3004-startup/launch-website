"use client";

import Image from "next/image";
import { useMedicineSearch } from "../hooks/search";

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
  const { state, setQuery, searchMedicines } = useMedicineSearch();

  return (
    <main className="w-full">
      {/* HERO */}
      <section className="bg-[#F5F7DA] px-12 py-24">
        <h1 className="text-6xl font-serif leading-tight text-[#0B2C3D]">
          Healthcare,
          <br />
          Without The Guesswork
        </h1>

        <p className="mt-4 text-lg text-[#0B2C3D]">
          Explore care options with confidence.
        </p>

        {/* SEARCH */}
        <div className="mt-8 flex w-full max-w-3xl">
          <input
            value={state.query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines..."
            className="flex-1 px-5 py-4 border border-gray-300 outline-none"
          />

          <button
            onClick={searchMedicines}
            disabled={state.loading}
            className="bg-[#0B2C3D] text-white px-10"
          >
            {state.loading ? "Searching..." : "Search"}
          </button>
        </div>

        {state.error && (
          <p className="mt-2 text-red-600">{state.error}</p>
        )}
      </section>

      {/* PHARMACIES */}
      <section className="px-12 py-16 text-center">
        <p className="text-[#0B2C3D] text-lg mb-8">
          Compare across popular pharmacies nationwide
        </p>

        <div className="flex justify-center items-center gap-14">
          <Image src={pharmacy} alt="Pharmacy" />
          <Image src={wellness} alt="Wellness Forever" />
          <Image src={tata1mg} alt="Tata 1mg" />
          <Image src={pharmeasy} alt="PharmEasy" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="px-12 py-24 text-center"
      >
        <h2 className="text-4xl font-serif text-[#0B2C3D] mb-16">
          How it works
        </h2>

        <div className="flex justify-between max-w-6xl mx-auto">
          <div className="flex flex-col items-center max-w-xs">
            <Image src={searchIcon} alt="Search" />
            <h4 className="mt-6 text-lg font-semibold">
              1. Search
            </h4>
            <p className="mt-2 text-sm">
              Search your prescribed medicine
            </p>
          </div>

          <div className="flex flex-col items-center max-w-xs">
            <Image src={compareIcon} alt="Compare" />
            <h4 className="mt-6 text-lg font-semibold">
              2. Compare
            </h4>
            <p className="mt-2 text-sm">
              Compare medicine prices across many pharmacies.
            </p>
          </div>

          <div className="flex flex-col items-center max-w-xs">
            <Image src={cartIcon} alt="Purchase" />
            <h4 className="mt-6 text-lg font-semibold">
              3. Purchase
            </h4>
            <p className="mt-2 text-sm">
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

  <div className="flex justify-between max-w-6xl mx-auto">
    {/* ITEM 1 */}
    <div className="flex flex-col items-center max-w-xs">
      <Image
        src={clarityIcon}
        alt="Clarity"
        className="mb-6"
      />
      <p className="text-lg font-medium">
        Clarity over complexity
      </p>
    </div>

    {/* ITEM 2 */}
    <div className="flex flex-col items-center max-w-xs">
      <Image
        src={thumbsUp}
        alt="Convenience"
        className="mb-6"
      />
      <p className="text-lg font-medium">
        One-search convenience
      </p>
    </div>

    {/* ITEM 3 */}
    <div className="flex flex-col items-center max-w-xs">
      <Image
        src={patientIcon}
        alt="Patient First"
        className="mb-6"
      />
      <p className="text-lg font-medium">
        Patient-first, not provider-first
      </p>
    </div>
  </div>
</section>
    </main>
  );
}
