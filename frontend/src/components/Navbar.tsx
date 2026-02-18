"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/images/logo.png";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="w-full bg-white backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="flex h-20 sm:h-24 md:h-28 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" aria-label="Go to home">
              <Image
                src={logo}
                alt="Doze by Medgency"
                width={360}
                height={90}
                priority
                className="h-12 w-auto sm:h-18 md:h-24 cursor-pointer"
                sizes="(max-width: 640px) 180px, (max-width: 768px) 240px, 360px"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#003554] text-base font-medium hover:underline underline-offset-4">
              About Us
            </Link>
            <button
              onClick={scrollToHowItWorks}
              className="text-[#003554] text-base font-medium hover:underline underline-offset-4"
            >
              Help
            </button>
            <Link
              href="/search"
              className="ml-2 inline-flex items-center rounded-full bg-[#0B2C3D] text-white px-5 py-2 text-sm font-semibold hover:bg-[#163a4d] transition-colors"
            >
              Get Started
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center rounded-full bg-[#0B2C3D] text-white px-4 py-2 text-sm font-semibold hover:bg-[#163a4d] transition-colors"
            >
              Search
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md border border-slate-200 px-3 py-2 text-[#003554]"
            >
              Menu
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
            <Link href="/" className="text-[#003554] text-sm font-medium">
              About Us
            </Link>
            <button onClick={scrollToHowItWorks} className="text-[#003554] text-sm font-medium text-left">
              Help
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
