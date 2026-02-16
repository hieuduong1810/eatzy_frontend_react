import axios from "axios";

const API_BASE_URL = "https://eatzy-be.hoanduong.net";

const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // send cookies (refresh_token)
});

// Track if we're currently refreshing to avoid infinite loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor: attach access token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 → refresh token
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't retry for login/register/refresh endpoints
            const skipPaths = ["/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/refresh"];
            if (skipPaths.some((p) => originalRequest.url?.includes(p))) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue the request while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return instance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await instance.get("/api/v1/auth/refresh");
                const newToken = response.data?.data?.access_token;

                if (newToken) {
                    localStorage.setItem("access_token", newToken);
                    if (response.data?.data?.user) {
                        localStorage.setItem("auth_user", JSON.stringify(response.data.data.user));
                    }
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Clear auth data and let the app handle redirect
                localStorage.removeItem("access_token");
                localStorage.removeItem("auth_user");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
