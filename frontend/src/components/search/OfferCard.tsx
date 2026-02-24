import Image, { StaticImageData } from "next/image";
import { useMemo } from "react";
import { getProviderLogoKey } from "@/constants/providers";

// Static image imports — consumers pass these in via logoMap
import tata1mg from "@/assets/images/tata1mg.png";
import pharmacyIcon from "@/assets/images/pharmacy.png";
import pharmeasyLogo from "@/assets/images/pharmeasy.png";

const LOGO_MAP: Record<string, StaticImageData | string> = {
    tata1mg,
    pharmeasy: pharmeasyLogo,
    apollo: "/logos/apollo.svg",
    truemeds: "/logos/truemeds.svg",
    medkart: "/logos/medkart.svg",
    netmeds: "/logos/netmeds.svg",
    default: pharmacyIcon,
};

interface OfferCardProps {
    medicineName: string;
    provider: string;
    price: string;
    href?: string | null;
}

export function OfferCard({ medicineName, provider, price, href }: OfferCardProps) {
    const logo = useMemo(() => {
        const key = getProviderLogoKey(provider);
        return LOGO_MAP[key] ?? LOGO_MAP.default;
    }, [provider]);

    const hasPrice = price !== "—";

    const buttonLabel = useMemo(() => {
        const isPharmeasy = provider.toLowerCase().includes("pharmeasy");
        return isPharmeasy && !hasPrice ? "Visit Site" : "Select";
    }, [provider, hasPrice]);

    return (
        <div className="relative rounded-xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-4 sm:px-6 sm:py-5">

                {/* Logo + Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Image
                        src={logo}
                        alt={provider}
                        className="h-9 w-9 sm:h-10 sm:w-10 object-contain flex-shrink-0"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[13px] sm:text-sm font-semibold text-slate-800 line-clamp-2">
                            {medicineName}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">
                            View details and pricing on {provider}
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex-shrink-0 text-left sm:text-center sm:min-w-[160px]">
                    <div className="text-sm sm:text-base md:text-lg font-medium text-slate-600 whitespace-nowrap">
                        {hasPrice ? `Starting from ₹${price}` : "Price unavailable"}
                    </div>
                </div>

                {/* CTA */}
                {href && (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex justify-center items-center gap-2 rounded-lg bg-[#2d6f86] px-5 py-2.5 sm:px-7 text-[13px] sm:text-[14px] font-bold text-white shadow-sm transition-all hover:bg-[#1e4b5b] flex-shrink-0 w-full sm:w-auto"
                    >
                        {buttonLabel}
                        <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                    </a>
                )}
            </div>
        </div>
    );
}