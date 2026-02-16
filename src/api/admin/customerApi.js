import axiosClient from "../axios";

const customerApi = {
    getAllCustomers: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/customer-profiles", {
                params: {
                    page: 1,
                    size: 1000,
                    ...params
                },
            });
            // Handle both structure types just in case
            return response.data?.result || response.data?.data?.result || [];
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    },

    getCustomerById: async (id) => {
        try {
            const response = await axiosClient.get(`/api/v1/customer-profiles/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error fetching customer details:", error);
            throw error;
        }
    },

    updateCustomer: async (id, data) => {
        try {
            const response = await axiosClient.put("/api/v1/customer-profiles", {
                id,
                ...data
            });
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    },

    deleteCustomer: async (id) => {
        try {
            await axiosClient.delete(`/api/v1/customer-profiles/${id}`);
            return true;
        } catch (error) {
            console.error("Error deleting customer:", error);
            throw error;
        }
    },

    createCustomer: async (data) => {
        try {
            const response = await axiosClient.post("/api/v1/customer-profiles", data);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error;
        }
    }
};

export default customerApi;
