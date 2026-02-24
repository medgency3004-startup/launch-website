import { Medicine } from "@/types";
import { OfferCard } from "./OfferCard";
import { formatPrice } from "@/lib/medicine";

interface ResultsListProps {
    results: Medicine[];
    loading: boolean;
    error: string | null;
}

export function ResultsList({ results, loading, error }: ResultsListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-2xl bg-white border border-slate-100 p-8 h-28"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-slate-600 font-medium">
                Some providers are temporarily unavailable. Showing links where possible.
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-slate-600 text-sm">
                No offers found. Try adjusting filters or a different query.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {results.map((med) => (
                <OfferCard
                    key={med.id}
                    medicineName={med.name}
                    provider={med.pharmacy}
                    price={formatPrice(med.price)}
                    href={med.url}
                />
            ))}
        </div>
    );
}