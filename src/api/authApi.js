import axios from "./axios";

const authApi = {
    /**
     * Login with username (email) and password
     * POST /api/v1/auth/login
     * @param {string} username - User email
     * @param {string} password - User password
     * @returns {Promise<{data: {access_token: string, user: {id, email, name, role}}}>}
     */
    login: (username, password) => {
        return axios.post("/api/v1/auth/login", { username, password });
    },

    /**
     * Register a new user
     * POST /api/v1/auth/register
     * @param {{name: string, email: string, password: string}} data
     * @returns {Promise}
     */
    register: (data) => {
        return axios.post("/api/v1/auth/register", data);
    },

    /**
     * Get current authenticated user
     * GET /api/v1/auth/account
     * @returns {Promise<{data: {user: {id, email, name, role}}}>}
     */
    getAccount: () => {
        return axios.get("/api/v1/auth/account");
    },

    /**
     * Refresh access token using refresh_token cookie
     * GET /api/v1/auth/refresh
     * @returns {Promise<{data: {access_token: string, user: object}}>}
     */
    refreshToken: () => {
        return axios.get("/api/v1/auth/refresh");
    },

    /**
     * Logout current user
     * POST /api/v1/auth/logout
     * @returns {Promise}
     */
    logout: () => {
        return axios.post("/api/v1/auth/logout");
    },
};

export default authApi;
