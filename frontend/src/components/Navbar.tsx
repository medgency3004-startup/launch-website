"use client";

import Image from "next/image";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100">
      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-12 py-5">
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src={logo}
            alt="Medgency"
            width={300}
            height={75}
            priority
          />
        </div>

        {/* NAV ITEMS */}
        <div className="flex items-center gap-10">
          {/* LINKS */}
          <div className="flex items-center gap-8">
            <span className="text-[#003554] text-base font-medium cursor-pointer">
              About Us
            </span>

            <span
              className="text-[#003554] text-base font-medium cursor-pointer"
              onClick={scrollToHowItWorks}
            >
              Help
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4">
            <button className="border border-[#003554] text-[#003554] px-6 py-2 rounded-md">
              Login
            </button>

            <button className="bg-[#003554] text-white px-6 py-2 rounded-md">
              Sign-up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
