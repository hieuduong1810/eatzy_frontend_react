import axiosClient from "../axios";

const promotionApi = {
    getAllPromotions: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/vouchers", {
                params: {
                    page: 1,
                    size: 100,
                    ...params
                }
            });
            // Handle different response structures if necessary
            return response.data?.data?.result || response.data?.result || response.data || [];
        } catch (error) {
            console.error("Error fetching promotions:", error);
            throw error;
        }
    },

    createGlobalPromotion: async (data) => {
        try {
            const response = await axiosClient.post("/api/v1/vouchers/all-restaurants", data);
            return response.data;
        } catch (error) {
            console.error("Error creating global promotion:", error);
            throw error;
        }
    },

    createSpecificPromotion: async (data) => {
        try {
            const response = await axiosClient.post("/api/v1/vouchers", data);
            return response.data;
        } catch (error) {
            console.error("Error creating specific promotion:", error);
            throw error;
        }
    },

    updatePromotion: async (id, data) => {
        try {
            const response = await axiosClient.put(`/api/v1/vouchers/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating promotion ${id}:`, error);
            throw error;
        }
    },

    deletePromotion: async (id) => {
        try {
            const response = await axiosClient.delete(`/api/v1/vouchers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting promotion ${id}:`, error);
            throw error;
        }
    },
};

export default promotionApi;
