import { Medicine } from "../types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://35.154.103.140";

export class ApiError extends Error {
  constructor(public status: number, public statusText: string) {
    super(`${status} ${statusText}`);
    this.name = "ApiError";
  }
}

export async function fetchMedicines(
  query: string,
  city: string = "CHENNAI",
  raw: boolean = false,
  signal?: AbortSignal
): Promise<any[]> {
  const params = new URLSearchParams({ q: query, city, raw: String(raw) });
  // We can try the local proxy first (if configured in next.config.ts)
  // or go directly to the backend if we want to avoid Next.js proxy issues or if we are rigorous about the ENV var.
  // Given the requirement "fetch it from [env]", let's prefer the env var.
  // However, next.config.ts sets up a rewrite for /api -> BACKEND_URL/api
  // using the same env vars.
  // To strictly follow "fetch it from [.env]", we can construct the full URL.

  // Clean trailing slash from BACKEND_URL if present
  const baseUrl = BACKEND_URL.replace(/\/+$/, "");
  const url = `${baseUrl}/api/search?${params.toString()}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new ApiError(res.status, res.statusText);
    }
    return await res.json();
  } catch (error) {
    // If the error is an abort error, simply rethrow it so the caller knows.
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    // Fallback: IF we failed to hit the full URL (CORS, network), maybe try the relative /api proxy?
    // But the prompt says "put backend url in .env, fetch it from there".
    // So if the direct fetch fails, it might be CORS.
    // Let's try to just re-throw for now, or we could implement a fallback to `/api/search`
    // which Next.js rewrites to the backend.

    // Let's rely on the direct fetch first as per instructions.
    throw error;
  }
}
