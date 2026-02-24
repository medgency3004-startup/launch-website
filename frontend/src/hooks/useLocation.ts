"use client";

import { useState, useEffect } from "react";

interface LocationState {
    city: string | null;
    pincode: string | null;
    loading: boolean;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

async function reverseGeocode(
    lat: number,
    lng: number
): Promise<{ city: string | null; pincode: string | null }> {
    const url = `${NOMINATIM_URL}?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, {
        headers: { "Accept-Language": "en" },
    });

    if (!res.ok) throw new Error("Geocoding request failed");

    const data = await res.json();
    const address = data.address || {};

    const city =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        null;

    const pincode = address.postcode?.replace(/\s+/g, "") || null;

    return {
        city: city?.toUpperCase() ?? null,
        pincode,
    };
}

export function useLocation(): LocationState {
    const [state, setState] = useState<LocationState>({
        city: null,
        pincode: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({ city: null, pincode: null, loading: false });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const { city, pincode } = await reverseGeocode(
                        coords.latitude,
                        coords.longitude
                    );
                    setState({ city, pincode, loading: false });
                } catch {
                    setState({ city: null, pincode: null, loading: false });
                }
            },
            () => {
                setState({ city: null, pincode: null, loading: false });
            },
            { timeout: 8000, maximumAge: 5 * 60 * 1000 }
        );
    }, []);

    return state;
}