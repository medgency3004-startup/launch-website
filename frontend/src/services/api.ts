const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "https://api.medgency.in/"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(public status: number, public statusText: string) {
    super(`${status} ${statusText}`);
    this.name = "ApiError";
  }
}

export async function fetchMedicines(
  query: string,
  pincode = "603203",
  raw = false,
  signal?: AbortSignal
): Promise<unknown[]> {
  const params = new URLSearchParams({ q: query, pincode, raw: String(raw) });
  const url = `${BACKEND_URL}/api/search?${params.toString()}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }

  return res.json();
}