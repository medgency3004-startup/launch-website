"use client";

import Image from "next/image";
import { useMedicineSearch } from "../hooks/search";

// pharmacy logos
import pharmacy from "../../assets/images/pharmacy.png";
import wellness from "../../assets/images/wellness.png";
import tata1mg from "../../assets/images/tata1mg.png";
import pharmeasy from "../../assets/images/pharmeasy.png";

// icons
import searchIcon from "../../assets/icons/search.png";
import compareIcon from "../../assets/icons/compare.png";
import cartIcon from "../../assets/icons/cart.png";
import thumbsUp from "../../assets/icons/thumbsup.png";

export default function HomePage() {
  const { state, setQuery, searchMedicines } = useMedicineSearch();

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          Healthcare,
          <br />
          Without The Guesswork
        </h1>
        <p>Explore care options with confidence.</p>

        <div className="search-bar">
          <input
            value={state.query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines..."
          />
          <button onClick={searchMedicines} disabled={state.loading}>
            {state.loading ? "Searching..." : "Search"}
          </button>
        </div>

        {state.error && <p className="error">{state.error}</p>}
      </section>

      {/* PHARMACY LOGOS */}
      <section className="pharmacies">
        <p>Compare across popular pharmacies nationwide</p>
        <div className="logos">
          <Image src={pharmacy} alt="Pharmacy" />
          <Image src={wellness} alt="Wellness Forever" />
          <Image src={tata1mg} alt="Tata 1mg" />
          <Image src={pharmeasy} alt="PharmEasy" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How it works</h2>

        <div className="steps">
          <div className="step">
            <Image src={searchIcon} alt="Search" />
            <h4>1. Search</h4>
            <p>Search your prescribed medicine</p>
          </div>

          <div className="step">
            <Image src={compareIcon} alt="Compare" />
            <h4>2. Compare</h4>
            <p>Compare medicine prices across many pharmacies.</p>
          </div>

          <div className="step">
            <Image src={cartIcon} alt="Purchase" />
            <h4>3. Purchase</h4>
            <p>Request your purchase with a tap</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose">
        <h2>Why Choose Us</h2>

        <div className="reasons">
          <p>Clarity over complexity</p>

          <div className="center">
            <Image src={thumbsUp} alt="Trust" />
            <p>One-search convenience</p>
          </div>

          <p>Patient-first, not provider-first</p>
        </div>
      </section>
    </main>
  );
}
