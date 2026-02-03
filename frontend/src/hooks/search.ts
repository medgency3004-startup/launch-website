import { useCallback, useRef, useState } from "react";
import { SearchState, Medicine } from "../types";

export function useMedicineSearch() {
  const [state, setState] = useState<SearchState>({
    query: "",
    loading: false,
    error: null,
    results: [],
  });
  const lastQueryRef = useRef<string | null>(null);
  const requestIdRef = useRef<number>(0);

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const searchMedicines = useCallback(async (query?: unknown) => {
    const qInput = typeof query === "string" ? query : undefined;
    const q = String(qInput ?? state.query ?? "").trim();
    if (!q) return;
    if (lastQueryRef.current === q) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const myId = ++requestIdRef.current;
      type BackendItem = {
        provider?: string;
        medicine_name?: string;
        available?: boolean | null;
        mrp?: number | null;
        price?: number | null;
        url?: string | null;
      };
      const params = new URLSearchParams({ q, city: "DELHI" });
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const raw: unknown = await res.json();
      const data: Medicine[] = (Array.isArray(raw) ? (raw as BackendItem[]) : []).map(
        (item: BackendItem, idx: number): Medicine => ({
          id: String(idx),
          name: item.medicine_name ?? "Unknown",
          price: item.price ?? 0,
          pharmacy: item.provider ?? "Unknown",
          url: item.url ?? null,
        })
      );

      if (myId === requestIdRef.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          results: data,
        }));
      }
      lastQueryRef.current = q;
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Something went wrong. Please try again.",
      }));
    } finally {
      // no-op
    }
  }, [state.query]);

  const clearSearch = useCallback(() => {
    lastQueryRef.current = null;
    setState({
      query: "",
      loading: false,
      error: null,
      results: [],
    });
  }, []);

  return {
    state,
    setQuery,
    searchMedicines,
    clearSearch,
  };
}
