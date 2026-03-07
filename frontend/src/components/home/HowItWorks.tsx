import Image from "next/image";
import searchIcon from "@/assets/icons/search.png";
import compareIcon from "@/assets/icons/compare.png";
import cartIcon from "@/assets/icons/cart.png";

const STEPS = [
    { icon: searchIcon, label: "Search", description: "Search your prescribed medicine" },
    { icon: compareIcon, label: "Compare", description: "Compare medicine prices across many pharmacies." },
    { icon: cartIcon, label: "Purchase", description: "Request your purchase with a tap" },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="px-4 sm:px-8 md:px-12 py-16 sm:py-24 text-center">
            <h2 className="text-4xl font-serif text-[#0B2C3D] mb-16">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
                {STEPS.map(({ icon, label, description }, i) => (
                    <div key={label} className="flex flex-col items-center">
                        <div className="h-20 w-20 flex items-center justify-center">
                            <Image src={icon} alt={label} />
                        </div>
                        <h4 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold text-[#0B2C3D]">
                            {i + 1}. {label}
                        </h4>
                        <p className="mt-2 text-slate-600">{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}