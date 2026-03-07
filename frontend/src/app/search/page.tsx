import { Suspense } from "react";
import { SearchContent } from "@/components/search/SearchContent";

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-[#F9FBF2]">
      <Suspense
        fallback={
          <div className="p-20 text-center text-[#0B2C3D] font-semibold">
            Loading Medicine Results...
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}