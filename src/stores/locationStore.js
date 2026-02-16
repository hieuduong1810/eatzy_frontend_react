import { useSyncExternalStore } from "react";

// ---- Internal Store State ----
const defaultLocation = {
    latitude: 10.762622,
    longitude: 106.660172,
    address: "123 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM",
    name: "Nhà riêng"
};

let location = (() => {
    try {
        const stored = localStorage.getItem("user_location");
        return stored ? JSON.parse(stored) : defaultLocation;
    } catch {
        return defaultLocation;
    }
})();

let listeners = new Set();

// ---- Cached Snapshot (MUST return same reference if data unchanged) ----
let cachedSnapshot = { location };

function emitChange() {
    cachedSnapshot = { location };
    listeners.forEach((listener) => listener());
}

// ---- Store Actions ----
export const locationActions = {
    setLocation(newLocation) {
        location = newLocation;
        localStorage.setItem("user_location", JSON.stringify(newLocation));
        emitChange();
    },

    getLocation() {
        return location;
    }
};

// ---- React Hook ----
function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return cachedSnapshot;
}

/**
 * React hook to access location state reactively
 * @returns {{ location: { latitude: number, longitude: number, address: string, name: string } }}
 */
export function useLocationStore() {
    return useSyncExternalStore(subscribe, getSnapshot);
}
