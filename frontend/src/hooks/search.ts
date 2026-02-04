import { useCallback, useRef, useState } from "react";
import { SearchState, Medicine } from "../types";

function mapItems(raw: unknown): Medicine[] {
  type BackendItem = {
    provider?: string;
    medicine_name?: string;
    available?: boolean | null;
    mrp?: number | null;
    price?: number | null;
    url?: string | null;
  };
  const list = Array.isArray(raw) ? (raw as BackendItem[]) : [];
  return list.map((item: BackendItem, idx: number): Medicine => ({
    id: String(idx),
    name: item.medicine_name ?? "Unknown",
    price: item.price ?? 0,
    pharmacy: item.provider ?? "Unknown",
    url: item.url ?? null,
  }));
}

function isAbortError(err: unknown): boolean {
  const e = err as { name?: string; code?: string | number; message?: unknown };
  const name = e && typeof e.name === "string" ? e.name : undefined;
  const code = e?.code;
  const msg = typeof e?.message === "string" ? e.message.toLowerCase() : "";
  return name === "AbortError" || code === "ERR_ABORTED" || msg.includes("aborted");
}

function errorMessage(err: unknown): string {
  const m = (err as { message?: unknown }).message;
  return typeof m === "string" ? m : "Something went wrong. Please try again.";
}

export function useMedicineSearch() {
  const [state, setState] = useState<SearchState>({
    query: "",
    loading: false,
    error: null,
    results: [],
  });
  const lastQueryRef = useRef<string | null>(null);
  const requestIdRef = useRef<number>(0);
  const controllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightQueryRef = useRef<string | null>(null);

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const searchMedicines = useCallback(async (query?: unknown) => {
    const qInput = typeof query === "string" ? query : undefined;
    const q = String(qInput ?? state.query ?? "").trim();
    if (!q) return;
    if (lastQueryRef.current === q) return;
    if (inFlightQueryRef.current === q) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const myId = ++requestIdRef.current;
      const params = new URLSearchParams({ q, city: "DELHI", raw: "true" });
      inFlightQueryRef.current = q;
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) {
        const statusText = res.statusText || "Unknown error";
        throw new Error(`Failed to fetch (${res.status} ${statusText})`);
      }
      const raw: unknown = await res.json();
      const data = mapItems(raw);

      if (myId === requestIdRef.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          results: data,
        }));
      }
      lastQueryRef.current = q;
    } catch (err) {
      if (isAbortError(err)) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }
      console.warn(err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage(err),
      }));
    } finally {
      if (inFlightQueryRef.current === q) {
        inFlightQueryRef.current = null;
      }
    }
  }, [state.query]);

  const clearSearch = useCallback(() => {
    lastQueryRef.current = null;
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
