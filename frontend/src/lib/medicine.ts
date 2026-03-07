import { Medicine } from "@/types";

type BackendItem = {
    provider: string;
    medicine_name: string;
    available: boolean | null;
    mrp: number | null;
    price: number | null;
    url: string | null;
};

/**
 * Maps raw backend items to the app's Medicine model.
 */
export function mapMedicineItems(raw: unknown): Medicine[] {
    const list = Array.isArray(raw) ? (raw as BackendItem[]) : [];
    return list.map(
        (item, idx): Medicine => ({
            id: String(idx),
            name: item.medicine_name ?? "Unknown",
            price: item.price ?? 0,
            pharmacy: item.provider ?? "Unknown",
            url: item.url ?? null,
        })
    );
}

/**
 * Returns true if an error originated from an aborted fetch request.
 */
export function isAbortError(err: unknown): boolean {
    const e = err as { name?: string; code?: string | number; message?: unknown };
    const name = typeof e?.name === "string" ? e.name : "";
    const code = e?.code;
    const msg = typeof e?.message === "string" ? e.message.toLowerCase() : "";
    return (
        name === "AbortError" ||
        code === "ERR_ABORTED" ||
        msg.includes("aborted")
    );
}

/**
 * Formats a price number to a display string.
 * Returns "—" for null / zero values.
 */
export function formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined || price <= 0) return "—";
    return price.toFixed(2);
}