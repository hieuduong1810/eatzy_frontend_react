import axiosClient from ".././axios";

const dashboardApi = {
    // Fetch all orders for client-side processing
    getAllOrders: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/orders", {
                params: {
                    page: 1,
                    size: 1000, // Fetch a large batch as per reference implementation
                    ...params
                },
            });
            // Try both structures: direct DTO or wrapped in 'data'
            return response.data?.result || response.data?.data?.result || [];
        } catch (error) {
            console.error("Error fetching all orders for dashboard:", error);
            return [];
        }
    },

    // We still need total counts for entities that aren't orders (Restaurants, Drivers, Customers)
    // The reference implementation seems to derive these from orders too, but that might be inaccurate for new/inactive entities
    // However, for strict adherence to "reference style", we should try to derive what we can, or keep using specific endpoints if they are better.
    // The user said "tham khảo cách gọi api", implying the *pattern* of data fetching.
    // "useDashboard.ts" in reference derives EVERYTHING from orders.
    // But let's keep the specific count endpoints available as fallbacks or for more accuracy if the user prefers, 
    // OR just stick to the requested single-source-of-truth pattern.
    // Let's keep a method to get other entities just in case, but primary logic will move to component.

    getUsers: async () => {
        try {
            const response = await axiosClient.get("/api/v1/users", { params: { page: 1, size: 1000 } });
            console.log("getUsers API response:", response.data);
            return response.data?.result || response.data?.data?.result || [];
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    },

    getRestaurants: async () => {
        try {
            const response = await axiosClient.get("/api/v1/restaurants", { params: { page: 1, size: 1000 } });
            return response.data?.result || response.data?.data?.result || [];
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            return [];
        }
    },

    getDrivers: async () => {
        try {
            const response = await axiosClient.get("/api/v1/driver-profiles", { params: { page: 1, size: 1000 } });
            return response.data?.result || response.data?.data?.result || [];
        } catch (error) {
            console.error("Error fetching drivers:", error);
            return [];
        }
    }
};

export default dashboardApi;
