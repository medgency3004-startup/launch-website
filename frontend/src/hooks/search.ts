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

function getBackendCandidates(): string[] {
  const candidates: string[] = [];
  try {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("medgency_backend_url");
      if (saved && typeof saved === "string" && saved.trim().length > 0) {
        candidates.push(saved.trim());
      }
    }
  } catch {}
  try {
    const env1 =
      typeof process !== "undefined" &&
      process.env &&
      typeof process.env.NEXT_PUBLIC_BACKEND_URL === "string"
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : undefined;
    const env2 =
      typeof process !== "undefined" &&
      process.env &&
      typeof process.env.BACKEND_URL === "string"
        ? process.env.BACKEND_URL
        : undefined;
    if (env1) candidates.push(env1);
    if (env2) candidates.push(env2);
  } catch {}
  return Array.from(new Set(candidates));
}

export function useMedicineSearch() {
  const [state, setState] = useState<SearchState>({
    query: "",
    loading: false,
    error: null,
    results: [],
    raw: false,
  });
  const lastQueryRef = useRef<string | null>(null);
  const requestIdRef = useRef<number>(0);
  const controllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightQueryRef = useRef<string | null>(null);

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
    if (inFlightQueryRef.current === q) return;

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
      timeoutRef.current = setTimeout(() => {
        try {
          controller.abort();
        } catch {}
      }, 8000);
      const myId = ++requestIdRef.current;
      const params = new URLSearchParams({ q, city: "DELHI", raw: state.raw ? "true" : "false" });
      inFlightQueryRef.current = q;
      let raw: unknown = null;
      let res: Response | null = null;
      try {
        res = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText || "Unknown error"}`);
        }
        raw = await res.json();
      } catch {
        const candidates = getBackendCandidates();
        let lastErr: unknown = null;
        for (const base of candidates) {
          try {
            const url = `${base.replace(/\/+$/,"")}/api/search?${params.toString()}`;
            const resDirect = await fetch(url, { mode: "cors", signal: controller.signal });
            if (!resDirect.ok) {
              throw new Error(`${resDirect.status} ${resDirect.statusText || "Unknown error"}`);
            }
            raw = await resDirect.json();
            lastErr = null;
            break;
          } catch (e) {
            lastErr = e;
            continue;
          }
        }
        if (lastErr) {
          throw lastErr;
        }
      }
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
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage(err),
      }));
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (controllerRef.current) {
        controllerRef.current = null;
      }
      if (inFlightQueryRef.current === q) {
        inFlightQueryRef.current = null;
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
