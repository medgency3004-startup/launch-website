"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="w-full bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" aria-label="Go to home">
              <Image
                src={logo}
                alt="Medgency"
                width={300}
                height={75}
                priority
                className="h-8 w-auto sm:h-10 md:h-16 cursor-pointer"
                sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 300px"
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
          <div className="md:hidden">
            <Link
              href="/search"
              className="inline-flex items-center rounded-full bg-[#0B2C3D] text-white px-4 py-2 text-sm font-semibold hover:bg-[#163a4d] transition-colors"
            >
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
