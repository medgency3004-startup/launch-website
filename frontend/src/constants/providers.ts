/**
 * Providers whose results are shown in search.
 * Keys must match the `provider` field returned by the backend (lowercased).
 */
export const ALLOWED_PROVIDERS = [
    "tata_1mg",
    "apollo",
    "truemeds",
    "pharmeasy",
    "medkart",
] as const;

export type AllowedProvider = (typeof ALLOWED_PROVIDERS)[number];

/**
 * Subset of providers whose prices get the "MedGency Verified" badge.
 */
export const VERIFIED_PROVIDERS: AllowedProvider[] = [
    "tata_1mg",
    "apollo",
    "truemeds",
];

/**
 * Map a provider name (any casing) to its logo path.
 * Returns a local image path string or a StaticImageData key name.
 * Consumers should map key names to actual imports as needed.
 */
export type ProviderLogoKey =
    | "tata1mg"
    | "pharmeasy"
    | "apollo"
    | "truemeds"
    | "medkart"
    | "netmeds"
    | "default";

export function getProviderLogoKey(provider: string): ProviderLogoKey {
    const p = provider.toLowerCase();
    if (p.includes("tata")) return "tata1mg";
    if (p.includes("pharmeasy")) return "pharmeasy";
    if (p.includes("apollo")) return "apollo";
    if (p.includes("truemeds")) return "truemeds";
    if (p.includes("medkart")) return "medkart";
    if (p.includes("netmeds")) return "netmeds";
    return "default";
}

export const POPULAR_SEARCHES = [
    "Dolo 650",
    "Crocin",
    "Amoxicillin",
    "Azithromycin",
    "Cetrizine",
    "Metformin",
    "Atorvastatin",
];