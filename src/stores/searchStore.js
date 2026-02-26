import { useSyncExternalStore } from "react";

// ---- Internal Store State ----
let searchKeyword = "";
let listeners = new Set();

// ---- Cached Snapshot ----
let cachedSnapshot = { searchKeyword };

function emitChange() {
    cachedSnapshot = { searchKeyword };
    listeners.forEach((listener) => listener());
}

// ---- Store Actions ----
export const searchActions = {
    setSearchKeyword(keyword) {
        searchKeyword = keyword;
        emitChange();
    },
    clearSearch() {
        searchKeyword = "";
        emitChange();
    },
};

// ---- React Hook ----
function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return cachedSnapshot;
}

export function useSearchStore() {
    return useSyncExternalStore(subscribe, getSnapshot);
}
