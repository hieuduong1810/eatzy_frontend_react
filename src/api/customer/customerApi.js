import axiosInstance from "../axios";
import axios from "axios"; // Direct import for external APIs

const customerApi = {
    /**
     * Get current user's favorite restaurants
     * GET /api/v1/favorites/my-favorites
     * @returns {Promise<{data: {data: Array<{id, customer, restaurant}>}}>}
     */
    getMyFavorites: () => {
        return axiosInstance.get("/api/v1/favorites/my-favorites");
    },
    removeFavorite: (id) => {
        return axiosInstance.delete(`/api/v1/favorites/${id}`);
    },
    addFavorite: (restaurantId) => {
        return axiosInstance.post("/api/v1/favorites", { restaurant: { id: restaurantId } });
    },

    /**
     * Get current user's order history
     * GET /api/v1/orders/my-customer?filter=...
     */
    getMyOrders: () => {
        const filter = "(orderStatus~'DELIVERED' or orderStatus~'CANCELLED' or orderStatus~'REJECTED')";
        return axiosInstance.get(`/api/v1/orders/my-customer?filter=${filter}`);
    },
    /**
     * Get restaurant types
     * GET /api/v1/restaurant-types
     */
    getRestaurantTypes: () => {
        return axiosInstance.get("/api/v1/restaurant-types");
    },
    /**
     * Get nearby restaurants
     * GET /api/v1/restaurants/nearby?latitude=...&longitude=...
     */
    getNearbyRestaurants: (lat, lng, filter = "") => {
        let url = `/api/v1/restaurants/nearby?latitude=${lat}&longitude=${lng}`;
        if (filter) {
            url += `&filter=${filter}`;
        }
        return axiosInstance.get(url);
    },
    /**
     * Get restaurant menu
     * GET /api/v1/restaurants/{id}/menu
     */
    getRestaurantMenu: (id) => {
        return axiosInstance.get(`/api/v1/restaurants/${id}/menu`);
    },
    /**
     * Get restaurant details
     * GET /api/v1/restaurants/{id}
     */
    getRestaurantById: (id) => {
        return axiosInstance.get(`/api/v1/restaurants/${id}`);
    },
    /**
     * Get restaurant by slug
     * GET /api/v1/restaurants/slug/{slug}
     */
    getRestaurantBySlug: (slug) => {
        return axiosInstance.get(`/api/v1/restaurants/slug/${slug}`);
    },
    /**
     * Add item to cart
     * POST /api/v1/carts
     * @param {Object} cartData - The cart data matching ReqCartDTO
     */
    addToCart: (cartData) => {
        return axiosInstance.post("/api/v1/carts", cartData);
    },
    /**
     * Get my carts
     * GET /api/v1/carts/my-carts
     */
    getMyCarts: () => {
        return axiosInstance.get("/api/v1/carts/my-carts");
    },
    /**
     * Get my wallet
     * GET /api/v1/wallets/my-wallet
     */
    getMyWallet: () => {
        return axiosInstance.get("/api/v1/wallets/my-wallet");
    },
    /**
     * Get restaurant vouchers
     * GET /api/v1/vouchers/restaurant/{restaurantId}
     */
    getRestaurantVouchers: (restaurantId) => {
        return axiosInstance.get(`/api/v1/vouchers/restaurant/${restaurantId}`);
    },
    /**
     * Calculate delivery fee
     * POST /api/v1/orders/delivery-fee
     * @param {Object} data - { restaurantId, deliveryLatitude, deliveryLongitude }
     */
    calculateDeliveryFee: (data) => {
        return axiosInstance.post("/api/v1/orders/delivery-fee", data);
    },
    /**
     * Search places via Mapbox Geocoding API
     * GET https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json
     */
    searchPlaces: (query, proximity) => {
        // Use the token directly here or from env. Getting it from DeliveryMapView context for now:
        const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=vn&limit=5`;
        if (proximity) {
            url += `&proximity=${proximity.lng},${proximity.lat}`;
        }
        // Use raw axios to avoid sending auth headers/cookies to Mapbox
        return axios.get(url);
    },
    /**
     * Get nearby places (POIs and Addresses) via Reverse Geocoding
     * GET https://api.mapbox.com/geocoding/v5/mapbox.places/{lng},{lat}.json?types=poi,address&limit=10
     */
    getNearbyPlaces: (lat, lng) => {
        const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        // Use raw axios to avoid sending auth headers/cookies to Mapbox
        return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=poi,address&limit=10`);
    },
    /**
     * Get reviews by order ID
     * GET /api/v1/reviews/order/{orderId}
     */
    getReviewsByOrderId: (orderId) => {
        return axiosInstance.get(`/api/v1/reviews/order/${orderId}`);
    },

    /**
     * Create a review
     * POST /api/v1/reviews
     * @param {Object} reviewData - The review data (rating, comment, targetId, targetType, orderId)
     */
    createReview: (reviewData) => {
        return axiosInstance.post("/api/v1/reviews", reviewData);
    },
};

export default customerApi;
