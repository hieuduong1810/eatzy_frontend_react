import axiosClient from "../axios";

const restaurantApi = {
    getAllRestaurants: async (params = {}) => {
        try {
            const queryParams = {
                page: 1,
                size: 1000,
                ...params
            };

            // If filter is provided, add it to query params
            if (params.filter) {
                queryParams.filter = params.filter;
            }

            const response = await axiosClient.get("/api/v1/restaurants", {
                params: queryParams,
            });
            return response.data?.result || response.data?.data?.result || [];
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            throw error;
        }
    },

    getRestaurantById: async (id) => {
        try {
            const response = await axiosClient.get(`/api/v1/restaurants/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching restaurant with id ${id}:`, error);
            throw error;
        }
    },

    createRestaurant: async (data) => {
        try {
            const response = await axiosClient.post("/api/v1/restaurants", data);
            return response.data;
        } catch (error) {
            console.error("Error creating restaurant:", error);
            throw error;
        }
    },

    updateRestaurant: async (id, data) => {
        try {
            const response = await axiosClient.put(`/api/v1/restaurants/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating restaurant with id ${id}:`, error);
            throw error;
        }
    },

    deleteRestaurant: async (id) => {
        try {
            const response = await axiosClient.delete(`/api/v1/restaurants/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting restaurant with id ${id}:`, error);
            throw error;
        }
    }
};

export default restaurantApi;
