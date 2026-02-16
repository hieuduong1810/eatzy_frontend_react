import axiosClient from "../axios";

const financeApi = {
    getAllTransactions: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/wallet-transactions", {
                params: {
                    page: 1,
                    size: 1000,
                    ...params
                },
            });
            return response.data?.data?.result || response.data?.result || [];
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw error;
        }
    },

    getTransactionById: async (id) => {
        try {
            const response = await axiosClient.get(`/api/v1/wallet-transactions/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await axiosClient.get(`/api/v1/orders/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    }
};

export default financeApi;
