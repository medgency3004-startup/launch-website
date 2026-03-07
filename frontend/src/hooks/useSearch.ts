import { useCallback, useRef, useState } from "react";
import { SearchState } from "@/types";
import { fetchMedicines } from "@/services/api";
import { mapMedicineItems, isAbortError } from "@/lib/medicine";

const SEARCH_TIMEOUT_MS = 10_000;
const DEFAULT_PINCODE = "603203"; // Chennai fallback

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    query: "",
    loading: false,
    error: null,
    results: [],
    raw: true,
  });

  const lastQueryRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingRequest = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const setRaw = useCallback((raw: boolean) => {
    setState((prev) => ({ ...prev, raw }));
    lastQueryRef.current = null;
  }, []);

  const searchMedicines = useCallback(
    async (overrideQuery?: string, pincode = DEFAULT_PINCODE) => {
      const q = (overrideQuery ?? state.query).trim();
      if (!q || lastQueryRef.current === q) return;

      clearPendingRequest();

      const controller = new AbortController();
      controllerRef.current = controller;
      timeoutRef.current = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

      const myId = ++requestIdRef.current;
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const raw = await fetchMedicines(q, pincode, state.raw, controller.signal);
        const results = mapMedicineItems(raw);

        if (myId === requestIdRef.current) {
          lastQueryRef.current = q;
          setState((prev) => ({ ...prev, loading: false, results }));
        }
      } catch (err) {
        if (isAbortError(err)) return;
        if (myId === requestIdRef.current) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Something went wrong",
          }));
        }
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    [state.query, state.raw]
  );

  const clearSearch = useCallback(() => {
    clearPendingRequest();
    lastQueryRef.current = null;
    setState((prev) => ({
      query: "",
      loading: false,
      error: null,
      results: [],
      raw: prev.raw,
    }));
  }, []);

  return { state, setQuery, setRaw, searchMedicines, clearSearch };
}