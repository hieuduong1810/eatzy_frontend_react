import { useSyncExternalStore } from "react";

// ---- Internal Store State ----
let token = localStorage.getItem("access_token") || null;
let user = (() => {
    try {
        const stored = localStorage.getItem("auth_user");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
})();

let listeners = new Set();

// ---- Cached Snapshot (MUST return same reference if data unchanged) ----
let cachedSnapshot = { token, user, isAuthenticated: !!token && !!user };

function emitChange() {
    cachedSnapshot = { token, user, isAuthenticated: !!token && !!user };
    listeners.forEach((listener) => listener());
}

// ---- Store Actions ----
export const authActions = {
    setLogin(accessToken, userData) {
        token = accessToken;
        user = userData;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        emitChange();
    },

    setToken(newToken) {
        token = newToken;
        if (newToken) {
            localStorage.setItem("access_token", newToken);
        } else {
            localStorage.removeItem("access_token");
        }
        emitChange();
    },

    setUser(userData) {
        user = userData;
        if (userData) {
            localStorage.setItem("auth_user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("auth_user");
        }
        emitChange();
    },

    logout() {
        token = null;
        user = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        emitChange();
    },

    getToken() {
        return token;
    },

    getUser() {
        return user;
    },

    isAuthenticated() {
        return !!token && !!user;
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

/**
 * React hook to access auth state reactively
 * @returns {{ token: string|null, user: object|null, isAuthenticated: boolean }}
 */
export function useAuthStore() {
    return useSyncExternalStore(subscribe, getSnapshot);
}
