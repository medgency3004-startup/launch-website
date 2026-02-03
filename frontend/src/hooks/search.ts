import { useState } from "react";
import { SearchState, Medicine } from "../types";

export function useMedicineSearch() {
  const [state, setState] = useState<SearchState>({
    query: "",
    loading: false,
    error: null,
    results: [],
  });

  const setQuery = (query: string) => {
    setState((prev) => ({ ...prev, query }));
  };

  const searchMedicines = async () => {
    if (!state.query.trim()) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      /**
       * 🔌 BACKEND INTEGRATION POINT
       *
       * const res = await fetch("/api/medicines/search", {
       *   method: "POST",
       *   headers: { "Content-Type": "application/json" },
       *   body: JSON.stringify({ query: state.query }),
       * });
       * const data = await res.json();
       */

      const data: Medicine[] = []; // mock for now

      setState((prev) => ({
        ...prev,
        loading: false,
        results: data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Something went wrong. Please try again.",
      }));
    }
  };

  return {
    state,
    setQuery,
    searchMedicines,
  };
}
