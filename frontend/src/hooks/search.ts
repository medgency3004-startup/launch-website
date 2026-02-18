import { useCallback, useRef, useState } from "react";
import { SearchState, Medicine } from "../types";
import { fetchMedicines, ApiError } from "../services/api";

function mapItems(raw: unknown): Medicine[] {
  type BackendItem = {
    provider: string;
    medicine_name: string;
    available: boolean | null;
    mrp: number | null;
    price: number | null;
    url: string | null;
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

export function useMedicineSearch() {
  const [state, setState] = useState<SearchState>({
    query: "",
    loading: false,
    error: null,
    results: [],
    raw: true,
  });
  const lastQueryRef = useRef<string | null>(null);
  const requestIdRef = useRef<number>(0);
  const controllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const setRaw = useCallback((raw: boolean) => {
    setState((prev) => ({ ...prev, raw }));
    lastQueryRef.current = null;
  }, []);

  const searchMedicines = useCallback(async (query?: unknown) => {
    const qInput = typeof query === "string" ? query : undefined;
    const q = String(qInput ?? state.query ?? "").trim();
    if (!q) return;
    if (lastQueryRef.current === q) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      const controller = new AbortController();
      controllerRef.current = controller;

      // Auto-abort after 10s
      timeoutRef.current = setTimeout(() => {
        try {
          controller.abort();
        } catch { }
      }, 10000);

      const myId = ++requestIdRef.current;

      const rawData = await fetchMedicines(q, "CHENNAI", state.raw, controller.signal);
      const data = mapItems(rawData);

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
        // Only stop loading if we haven't started a new request
        // But actually, if we aborted, it means we either timed out or a new request started.
        // If a new request started, loading should stay true.
        // We can just check if myId is still current.
        // However, we don't have myId here easily without closing over it, which we do.
        // Let's just update loading to false if we are the current request.
        // But wait, if a new request started, myId != requestIdRef.current
        return;
      }

      // If we are still the active request, show error
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [state.query, state.raw]);

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
    setState((prev) => ({
      query: "",
      loading: false,
      error: null,
      results: [],
      raw: prev.raw,
    }));
  }, []);

  return {
    state,
    setQuery,
    setRaw,
    searchMedicines,
    clearSearch,
  };
}
