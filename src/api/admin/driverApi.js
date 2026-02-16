import axiosClient from "../axios";

const driverApi = {
    getAllDrivers: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/driver-profiles", {
                params: {
                    page: 1,
                    size: 1000,
                    ...params
                },
            });
            return response.data?.result || response.data?.data?.result || [];
        } catch (error) {
            console.error("Error fetching drivers:", error);
            throw error;
        }
    },

    createDriver: async (data) => {
        try {
            const response = await axiosClient.post("/api/v1/driver-profiles", data);
            return response.data;
        } catch (error) {
            console.error("Error creating driver:", error);
            throw error;
        }
    },

    getDriverById: async (id) => {
        try {
            const response = await axiosClient.get(`/api/v1/driver-profiles/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching driver with id ${id}:`, error);
            throw error;
        }
    },

    updateDriver: async (id, data) => {
        try {
            const response = await axiosClient.put(`/api/v1/driver-profiles`, { id, ...data });
            return response.data;
        } catch (error) {
            console.error(`Error updating driver with id ${id}:`, error);
            throw error;
        }
    },

    deleteDriver: async (id) => {
        try {
            const response = await axiosClient.delete(`/api/v1/driver-profiles/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting driver with id ${id}:`, error);
            throw error;
        }
    }
};

export default driverApi;
